import axios from "axios";

const token = process.env.CRON_TOKEN;
const secret = process.env.API_SECRET;

export const generateCronDateString = (date: bigint) => {
  const dateFormatted = new Date(Number(date));

  const minutes = dateFormatted.getMinutes();
  const hours = dateFormatted.getHours();
  const days = dateFormatted.getDate();
  const months = dateFormatted.getMonth() + 1;
  const dayOfWeek = dateFormatted.getDay();

  const cronString = `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
  return cronString;
};

export const getCronsList = async (): Promise<ICronJob[]> => {
  if (!token) throw new Error("invalid token");

  try {
    const cronList = await axios.get<ICronsList>(
      `https://www.easycron.com/rest/list?token=${token}`
    );
    const cronJobs = cronList.data.cron_jobs;
    return cronJobs;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getMatchingCronJobByCronString = async (cronString: string) => {
  const cronJobs = await getCronsList();
  if (cronJobs.length === 0) return undefined;

  const matchingCronJob = cronJobs.find(
    (cron) => cron.cron_expression === cronString
  );
  return matchingCronJob;
};

export const removePostFromCronJob = async (
  cronString: string,
  postId: string
): Promise<ICrobJobResponseOk | ICrobJobResponseError> => {
  if (!token) throw new Error("invalid token");

  const matchingCronJob = await getMatchingCronJobByCronString(cronString);

  if (!matchingCronJob) {
    const res = {
      status: "error",
      error: {
        code: "internal",
        message: "cron job not found",
      },
    };
    return res;
  }

  const previousPayload = (await JSON.parse(
    matchingCronJob.http_message_body
  )) as IHttpMessageBodyParsed;

  //   IF CURRENT TASK IS THE ONLY TASK IN THE JOB, REMOVE THE JOB COMPLETELY
  if (
    previousPayload.redditPostIds.length === 1 &&
    previousPayload.redditPostIds[0] === postId
  ) {
    try {
      const res = await axios.get<ICrobJobResponseOk | ICrobJobResponseError>(
        `https://www.easycron.com/rest/delete?token=${token}&id=${matchingCronJob.cron_job_id}`
      );
      return res.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        const res = {
          status: "error",
          error: {
            code: "internal",
            message: err.message,
          },
        };
        return res;
      }
      const res = {
        status: "error",
        error: {
          code: "internal",
          message: "something went wrong when deleting cron job",
        },
      };
      return res;
    }
  }

  //    ELSE UPDATE CRON JOB'S PAYLOAD

  const filteredData = previousPayload.redditPostIds.filter(
    (id) => id !== postId
  );
  previousPayload.redditPostIds = filteredData;
  const jsonPayload = JSON.stringify(previousPayload);

  // EDIT THE CRON JOB BY ID
  try {
    const res = await axios.get<ICrobJobResponseOk | ICrobJobResponseError>(
      `https://www.easycron.com/rest/edit?token=fad86873a0a32c6def17481c4fce71b0&id=${matchingCronJob.cron_job_id}&http_message_body=${jsonPayload}`
    );
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      const res = {
        status: "error",
        error: {
          code: "internal",
          message: err.message,
        },
      };
      return res;
    }
    const res = {
      status: "error",
      error: {
        code: "internal",
        message: "something went wrong when updating cron job",
      },
    };
    return res;
  }
};

// *************************************

interface ICrobJobResponseOk {
  status: string;
  cron_job_id: string;
}

interface ICrobJobResponseError {
  status: string;
  error: ICronJobError;
}

interface ICronJobError {
  code: string;
  message: string;
}

interface ICronsList {
  status: string;
  cron_jobs: ICronJob[];
}

interface ICronJob {
  cron_job_id: number;
  cron_job_name: string;
  description: string;
  user_id: number;
  url: string;
  auth_user: string;
  auth_pw: string;
  cron_expression: string;
  epds_occupied: number;
  email_me: number;
  sensitivity: number;
  send_slack: number;
  slack_sensitivity: 1;
  slack_url: string;
  group_id: number;
  http_method: string;
  http_headers: string;
  http_message_body: string;
  custom_timeout: number;
  criterion: number;
  success_regexp: string;
  failure_regexp: string;
  wh: number;
  wh_url: string;
  wh_http_method: string;
  wh_data: string[];
  status: number;
  created: string;
  updated: string;
  total_success: string;
  total_failure: string;
  number_failed_time: string;
  total_successes: string;
  total_failures: string;
}

interface IHttpMessageBodyParsed {
  secret: string;
  redditPostIds: string[];
}

// \"secret\": \"QiYYxpseuHWQxey1ZwrY5pK3sQc3XPfaoXrmH2tEYs\", \"redditPostIds\": [\"6ccbef40-0e0a-4e6a-91a0-5c0edc22f19e\"]}",
