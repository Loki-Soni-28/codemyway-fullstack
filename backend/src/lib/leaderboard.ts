import { prisma } from './db';

export type LeaderboardRow = {
  rank: number;
  id: string;
  name: string;
  assignmentScore: number;
  contestScore: number;
  overallScore: number;
};

const percent = (earned: number, total: number) => (total > 0 ? Math.round((earned / total) * 100) : 0);

// Sums the points of questions a student answered correctly, counting each question once
// even if it was submitted several times.
function earnedPoints(
  submissions: { questionId: string; isCorrect: boolean }[],
  pointsByQuestion: Map<string, number>
) {
  const solved = new Set(submissions.filter((s) => s.isCorrect).map((s) => s.questionId));
  let earned = 0;
  for (const id of solved) earned += pointsByQuestion.get(id) ?? 0;
  return earned;
}

// Ranks every student in a batch by real results:
// - assignment score: % of points earned on assignments from the batch's completed classes
// - contest score: % of points earned in contests that have started
// - overall: 60% assignments + 40% contests (or whichever exists, if only one does)
export async function computeBatchLeaderboard(batchId: string): Promise<LeaderboardRow[]> {
  const [profiles, assignmentQuestions, contestQuestions] = await Promise.all([
    prisma.studentProfile.findMany({
      where: { batchId },
      select: {
        userId: true,
        user: {
          select: {
            name: true,
            submissions: { select: { questionId: true, isCorrect: true } },
            contestSubmissions: { select: { questionId: true, isCorrect: true } },
          },
        },
      },
    }),
    prisma.question.findMany({
      where: { assignment: { class: { batchId, status: 'COMPLETED' } } },
      select: { id: true, points: true },
    }),
    prisma.contestQuestion.findMany({
      where: { contest: { startTime: { lte: new Date() } } },
      select: { id: true, points: true },
    }),
  ]);

  const assignmentPoints = new Map(assignmentQuestions.map((q) => [q.id, q.points]));
  const contestPoints = new Map(contestQuestions.map((q) => [q.id, q.points]));
  const assignmentTotal = assignmentQuestions.reduce((sum, q) => sum + q.points, 0);
  const contestTotal = contestQuestions.reduce((sum, q) => sum + q.points, 0);

  const rows = profiles.map((p) => {
    const assignmentScore = percent(earnedPoints(p.user.submissions, assignmentPoints), assignmentTotal);
    const contestScore = percent(earnedPoints(p.user.contestSubmissions, contestPoints), contestTotal);

    let overallScore = 0;
    if (assignmentTotal > 0 && contestTotal > 0) {
      overallScore = Math.round(assignmentScore * 0.6 + contestScore * 0.4);
    } else if (assignmentTotal > 0) {
      overallScore = assignmentScore;
    } else if (contestTotal > 0) {
      overallScore = contestScore;
    }

    return {
      id: p.userId,
      name: p.user.name,
      assignmentScore,
      contestScore,
      overallScore,
    };
  });

  rows.sort((a, b) => b.overallScore - a.overallScore || a.name.localeCompare(b.name));
  return rows.map((row, i) => ({ rank: i + 1, ...row }));
}
