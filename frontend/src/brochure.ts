// Builds the program brochure as a PDF in the browser and downloads it, so nothing has to be
// emailed. The content comes from the same curriculum data as the course page.
const SITE = 'codemyway.tech';

// jsPDF's built-in fonts only cover Latin-1, so drop anything outside it (e.g. the rupee sign).
const clean = (text: string) =>
  text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/[^\x20-\x7E -ÿ]/g, '');

export async function downloadBrochure(programTitle: string): Promise<void> {
  const [{ jsPDF }, { PROGRAM_SLIDES }] = await Promise.all([
    import('jspdf'),
    import('./components/courses/CourseDetailsPage'),
  ]);

  const wanted = programTitle.toLowerCase();
  const matched = PROGRAM_SLIDES.filter((slide) =>
    (wanted.includes('data science') && slide.id === 'dsml') ||
    (wanted.includes('data analyst') && slide.id === 'data-analyst-genai'),
  );
  const slides = matched.length ? matched : PROGRAM_SLIDES;

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 48;
  const textWidth = width - margin * 2;
  let y = margin;

  const ensure = (needed: number) => {
    if (y + needed > height - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (
    text: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; indent?: number; gap?: number } = {},
  ) => {
    const { size = 10.5, bold = false, color = [40, 40, 50], indent = 0, gap = 4 } = opts;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines: string[] = doc.splitTextToSize(clean(text), textWidth - indent);
    const lineHeight = size * 1.35;
    for (const line of lines) {
      ensure(lineHeight);
      doc.text(line, margin + indent, y + size);
      y += lineHeight;
    }
    y += gap;
  };

  // Cover band
  doc.setFillColor(46, 26, 71);
  doc.rect(0, 0, width, 110, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(241, 196, 15);
  doc.text('CodeMyWay', margin, 55);
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(slides.length > 1 ? 'Program Brochure' : clean(slides[0].fullTitle), margin, 80);
  y = 140;

  slides.forEach((slide, index) => {
    if (index > 0) {
      doc.addPage();
      y = margin;
    }
    write(slide.fullTitle, { size: 18, bold: true, color: [46, 26, 71], gap: 6 });
    write(slide.subtitle, { gap: 8 });
    write(`Duration: ${slide.duration}`, { bold: true, gap: 2 });
    write(`Level: ${slide.levelBadge}  |  ${slide.audienceBadge}`, { gap: 8 });

    // Marketing claims about job outcomes are left out of a downloadable document.
    const highlights = slide.highlights.map((h) => h.label).filter((label) => !/placement/i.test(label));
    if (highlights.length) {
      write('Program highlights', { size: 12, bold: true, color: [46, 26, 71], gap: 3 });
      highlights.forEach((label) => write(`-  ${label}`, { indent: 8, gap: 1 }));
      y += 8;
    }

    write(slide.curriculumTitle, { size: 14, bold: true, color: [46, 26, 71], gap: 3 });
    write(slide.curriculumDesc, { gap: 10 });

    [slide.phase1, slide.phase2].forEach((phase) => {
      ensure(80);
      write(phase.tag, { size: 9.5, bold: true, color: [123, 63, 160], gap: 1 });
      write(phase.title, { size: 12.5, bold: true, color: [46, 26, 71], gap: 2 });
      write(phase.desc, { gap: 4 });
      phase.items.forEach((item) => {
        write(`-  ${item.title} ${item.desc}`, { indent: 8, gap: 2 });
      });
      write(`Included: ${phase.perk}`, { bold: true, gap: 1 });
      write(`Capstone: ${phase.project}`, { bold: true, gap: 12 });
    });
  });

  // Closing note and page numbers
  ensure(70);
  write('Fees, batch dates and current offers', { size: 12, bold: true, color: [46, 26, 71], gap: 3 });
  write(`Fees, registration details and any running offers change from batch to batch. See the latest on ${SITE} or book a call with a mentor from the website.`);

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(130, 130, 140);
    doc.text(`${SITE}  |  Page ${page} of ${pages}`, margin, height - 24);
  }

  const fileName = slides.length === 1
    ? `CodeMyWay-${slides[0].id}-brochure.pdf`
    : 'CodeMyWay-program-brochure.pdf';
  doc.save(fileName);
}
