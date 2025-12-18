
import React from 'react';
import { Question } from '../types';
import RubyText from './RubyText';

interface QuizCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  selectedAnswer?: string;
  isCorrect?: boolean | null;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, onAnswer, selectedAnswer, isCorrect }) => {
  return (
    <div className="custom-card p-8 md:p-12 relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="text-7xl mb-6 bouncing drop-shadow-sm">{question.visualAid}</div>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 leading-relaxed px-2">
          <RubyText text={question.text} />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {question.options?.map((option, index) => (
          <button
            key={index}
            onClick={() => !selectedAnswer && onAnswer(option)}
            disabled={!!selectedAnswer}
            className={`
              p-6 rounded-3xl text-2xl font-black border-4 transition-all duration-200 min-h-[100px] flex items-center justify-center
              ${selectedAnswer === option 
                ? (isCorrect ? 'bg-green-100 border-green-500 scale-105' : 'bg-red-50 border-red-400') 
                : 'bg-white border-gray-100 hover:border-[#64DFDF] hover:bg-[#F0FFFF] hover:scale-[1.02] shadow-sm'}
              ${selectedAnswer && option === question.answer && selectedAnswer !== option ? 'bg-green-50 border-green-300' : ''}
            `}
          >
            <RubyText text={option} />
          </button>
        ))}
      </div>

      {selectedAnswer && (
        <div className="mt-10 text-center">
          {isCorrect ? (
            <div className="text-[#64DFDF] font-black text-3xl animate-bounce">
              太[ㄊㄞˋ] 棒[ㄅㄤˋ] 了[ㄌㄜ˙]！ 答[ㄉㄚˊ] 對[ㄉㄨㄟˋ] 了[ㄌㄜ˙]！ ⭐
            </div>
          ) : (
            <div className="text-red-400 font-bold text-xl">
               <span className="block mb-1 text-gray-400 text-sm">沒關係，再接再厲！</span>
              正[ㄓㄥˋ] 確[ㄑㄩㄝˋ] 答[ㄉㄚˊ] 案[ㄢˋ] 是[ㄕˋ]：
              <div className="mt-2 inline-block bg-green-100 px-6 py-1.5 rounded-full text-green-700 border-2 border-green-200">
                <RubyText text={question.answer} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizCard;
