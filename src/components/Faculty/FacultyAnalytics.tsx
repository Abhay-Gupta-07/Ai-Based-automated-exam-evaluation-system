import React from 'react';
import { EvaluationResult } from '../../types';
import { OverviewBarChart, QuestionWiseChart, TopicMasteryRadar } from '../Common/Charts';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';

interface Props {
  evaluations: EvaluationResult[];
}

export const FacultyAnalytics: React.FC<Props> = ({ evaluations }) => {
  const questionData = [
    { qNo: 'Q1: Transformers', avgMarks: 8.8, maxMarks: 10, semanticMatch: 92 },
    { qNo: 'Q2: Stemming/Lemma', avgMarks: 7.5, maxMarks: 10, semanticMatch: 86 },
  ];

  const topicMasteryData = [
    { topic: 'Self-Attention', mastery: 92, fullMark: 100 },
    { topic: 'Multi-Head Projections', mastery: 88, fullMark: 100 },
    { topic: 'Positional Encoding', mastery: 84, fullMark: 100 },
    { topic: 'Tokenization', mastery: 95, fullMark: 100 },
    { topic: 'Lemmatization POS', mastery: 78, fullMark: 100 },
    { topic: 'Encoder Residuals', mastery: 65, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="liquid-glass p-5 rounded-2xl">
        <h2 className="text-xl font-bold text-slate-900">Student Performance Analytics</h2>
        <p className="text-xs text-slate-500">Topic-wise mastery radar, weak area analysis, and question-by-question semantic scores</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Question Wise Analysis */}
        <div className="liquid-glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Question-wise Score Analysis</h3>
              <p className="text-xs text-slate-500">Average marks obtained vs semantic match percentage</p>
            </div>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <QuestionWiseChart data={questionData} />
        </div>

        {/* Topic Mastery Radar */}
        <div className="liquid-glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Concept Mastery Radar</h3>
              <p className="text-xs text-slate-500">Class understanding across key subject concepts</p>
            </div>
            <Target className="w-5 h-5 text-emerald-600" />
          </div>
          <TopicMasteryRadar data={topicMasteryData} />
        </div>
      </div>
    </div>
  );
};
