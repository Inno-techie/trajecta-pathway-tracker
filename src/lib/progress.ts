import {
  APTITUDE_TOPICS,
  CODING_TARGET,
  CODING_TOPICS,
  INTERVIEW_TOPICS,
  TECHNICAL_TOPICS,
  pct,
} from "./trajecta";
import { useCodingTopics, usePracticeLogs } from "./data";

export type ProgressBreakdown = {
  aptitude: number;
  coding: number;
  technical: number;
  interview: number;
  overall: number;
};

/**
 * Preparation progress derived only from stored user activity:
 * topic coverage for aptitude/technical/interview, solved problems for coding.
 */
export function useOverallProgress(): ProgressBreakdown {
  const { data: logs = [] } = usePracticeLogs();
  const { data: coding = [] } = useCodingTopics();

  const covered = (category: string, topics: readonly string[]) => {
    const set = new Set(
      logs.filter((l) => l.category === category && topics.includes(l.topic)).map((l) => l.topic),
    );
    return pct(set.size, topics.length);
  };

  const aptitude = covered("aptitude", APTITUDE_TOPICS);
  const technical = covered("technical", TECHNICAL_TOPICS);
  const interview = covered("interview", INTERVIEW_TOPICS);

  const solved = coding.reduce((sum, t) => sum + t.easy + t.medium + t.hard, 0);
  const topicCoverage = pct(
    coding.filter((t) => t.easy + t.medium + t.hard > 0 && CODING_TOPICS.includes(t.topic as never))
      .length,
    CODING_TOPICS.length,
  );
  const codingScore = Math.round((pct(solved, CODING_TARGET) + topicCoverage) / 2);

  const overall = Math.round((aptitude + technical + interview + codingScore) / 4);

  return { aptitude, coding: codingScore, technical, interview, overall };
}
