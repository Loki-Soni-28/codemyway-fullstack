import { BigQuery } from '@google-cloud/bigquery';

let bigquery: BigQuery | null = null;

try {
  // Initialize only if GCP credentials or project settings exist
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GCLOUD_PROJECT) {
    bigquery = new BigQuery();
  }
} catch (e) {
  console.warn('BigQuery client could not initialize. Analytics streaming is disabled.', e);
}

// Optional: analytics are streamed to BigQuery only when GCP credentials are configured.
const DATASET_ID = process.env.BIGQUERY_DATASET || 'codemyway_analytics';

export async function logSubmissionToBigQuery(data: {
  studentId: string;
  studentName: string;
  assignmentTitle: string;
  score: number;
  maxScore: number;
  submittedAt: string;
}) {
  console.log(`[BigQuery Log] Streaming Submission: ${data.studentName} scored ${data.score}/${data.maxScore} on "${data.assignmentTitle}"`);

  if (!bigquery) {
    return;
  }

  try {
    const dataset = bigquery.dataset(DATASET_ID);
    const table = dataset.table('assignment_submissions');
    await table.insert([{
      student_id: data.studentId,
      student_name: data.studentName,
      assignment_title: data.assignmentTitle,
      score: data.score,
      max_score: data.maxScore,
      submitted_at: data.submittedAt
    }]);
    console.log('[BigQuery Log] Inserted row into Google BigQuery.');
  } catch (error) {
    console.error('[BigQuery Log] Error logging submission to GCP:', error);
  }
}

export async function logAttendanceToBigQuery(data: {
  studentId: string;
  studentName: string;
  classTitle: string;
  status: string;
  markedAt: string;
}) {
  console.log(`[BigQuery Log] Streaming Attendance: ${data.studentName} marked ${data.status} for class "${data.classTitle}"`);

  if (!bigquery) {
    return;
  }

  try {
    const dataset = bigquery.dataset(DATASET_ID);
    const table = dataset.table('attendance_logs');
    await table.insert([{
      student_id: data.studentId,
      student_name: data.studentName,
      class_title: data.classTitle,
      status: data.status,
      marked_at: data.markedAt
    }]);
    console.log('[BigQuery Log] Inserted row into Google BigQuery.');
  } catch (error) {
    console.error('[BigQuery Log] Error logging attendance to GCP:', error);
  }
}
