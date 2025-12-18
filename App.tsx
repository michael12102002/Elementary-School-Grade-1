
import React, { useState, useEffect } from 'react';
import { Subject, Question } from './types';
import Layout from './components/Layout';
import QuizCard from './components/QuizCard';
import RubyText from './components/RubyText';
import { generateQuestions, getAIFeedback } from './services/geminiService';

const App: React.FC = () => {
  const [currentSubject, setCurrentSubject] = useState<Subject>('none');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem('stars_standard');
    return saved ? parseInt(saved) : 0;
  });
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(undefined);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [aiFeedback, setAiFeedback] = useState("");

  useEffect(() => {
    localStorage.setItem('stars_standard', stars.toString());
  }, [stars]);

  const startQuiz = async (subject: Subject) => {
    setLoading(true);
    setCurrentSubject(subject);
    const data = await generateQuestions(subject as 'math' | 'chinese');
    setQuestions(data);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(undefined);
    setIsCorrect(null);
    setQuizFinished(false);
    setAiFeedback("");
    setLoading(false);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const correct = answer === questions[currentIndex].answer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
      setStars(prev => prev + 10);
    }
  };

  const nextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(undefined);
      setIsCorrect(null);
    } else {
      setQuizFinished(true);
      const feedback = await getAIFeedback(score, questions.length, currentSubject);
      setAiFeedback(feedback);
    }
  };

  const reset = () => {
    setCurrentSubject('none');
    setQuestions([]);
    setQuizFinished(false);
  };

  if (currentSubject === 'none') {
    return (
      <Layout stars={stars}>
        <div className="text-center py-12">
          <div className="text-8xl mb-8 bouncing">🎈</div>
          <h2 className="text-4xl font-black text-gray-800 mb-6">
            <RubyText text="哈[ㄏㄚ] 囉[ㄌㄨㄛ]！ 今[ㄐㄧㄣ] 天[ㄊㄧㄢ] 想[ㄒㄧㄤˇ] 玩[ㄨㄢˊ] 什[ㄕㄣˊ] 麼[ㄇㄜ˙]？" />
          </h2>
          <p className="text-xl text-gray-500 mb-12 font-bold">
            <RubyText text="挑[ㄊㄧㄠ] 戰[ㄓㄢˋ] 20 題[ㄊㄧˊ]， 贏[ㄧㄥˊ] 取[ㄑㄩˇ] 小[ㄒㄧㄠˇ] 星[ㄒㄧㄥ] 星[ㄒㄧㄥ]！" />
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <button 
              onClick={() => startQuiz('math')}
              className="bg-white border-4 border-[#FF85A1] hover:bg-[#FFF0F3] text-[#FF85A1] rounded-[2.5rem] p-10 transform hover:scale-105 transition-all shadow-lg group btn-shadow-pink"
            >
              <div className="text-7xl mb-4 group-hover:rotate-6 transition-transform">🍎</div>
              <h3 className="text-3xl font-black mb-3">
                <RubyText text="趣[ㄑㄩˋ] 味[ㄨㄟˋ] 數[ㄕㄨˋ] 學[ㄒㄩㄝˊ]" />
              </h3>
              <span className="text-gray-400 font-bold">20 題練習</span>
            </button>

            <button 
              onClick={() => startQuiz('chinese')}
              className="bg-white border-4 border-[#64DFDF] hover:bg-[#F0FFFF] text-[#64DFDF] rounded-[2.5rem] p-10 transform hover:scale-105 transition-all shadow-lg group btn-shadow-mint"
            >
              <div className="text-7xl mb-4 group-hover:-rotate-6 transition-transform">🎨</div>
              <h3 className="text-3xl font-black mb-3">
                <RubyText text="注[ㄓㄨˋ] 音[ㄧㄣ] 大[ㄉㄚˋ] 冒[ㄇㄠˋ] 險[ㄒㄧㄢˇ]" />
              </h3>
              <span className="text-gray-400 font-bold">20 題練習</span>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout stars={stars}>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 border-8 border-gray-100 border-t-[#64DFDF] rounded-full animate-spin mb-8"></div>
          <h2 className="text-2xl font-black text-gray-500 animate-pulse">
            <RubyText text="正[ㄓㄥˋ] 在[ㄗㄞˋ] 準[ㄓㄨㄣˇ] 備[ㄅㄟˋ] 題[ㄊㄧˊ] 目[ㄇㄨˋ]..." />
          </h2>
        </div>
      </Layout>
    );
  }

  if (quizFinished) {
    return (
      <Layout stars={stars}>
        <div className="bg-white rounded-[3rem] p-10 shadow-xl text-center border-t-8 border-[#accent-color] relative">
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-4xl font-black text-gray-800 mb-6">
            <RubyText text="太[ㄊㄞˋ] 厲[ㄌㄧˋ] 害[ㄏㄞˋ] 了[ㄌㄜ˙]！" />
          </h2>
          
          <div className="bg-gray-50 inline-block px-10 py-6 rounded-3xl mb-10 border-2 border-gray-100">
            <div className="text-3xl font-black text-gray-700">
              得分：<span className="text-[#FF85A1] text-5xl mx-2">{score}</span> / {questions.length}
            </div>
          </div>
          
          <div className="bg-[#FFF9F0] p-8 rounded-3xl mb-10 text-left border-l-8 border-[#FFB347]">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">✨</span>
              <span className="text-xl font-black text-gray-700">
                <RubyText text="導[ㄉㄠˇ] 師[ㄕ] 的[ㄉㄜ˙] 鼓[ㄍㄨˇ] 勵[ㄌㄧˋ]：" />
              </span>
            </div>
            <p className="text-2xl text-gray-600 leading-relaxed font-bold">
              <RubyText text={aiFeedback} />
            </p>
          </div>

          <button 
            onClick={reset}
            className="bg-[#FF85A1] hover:bg-[#f07b97] text-white text-3xl font-black py-5 px-16 rounded-full shadow-lg transform hover:scale-105 transition-all btn-shadow-pink"
          >
            <RubyText text="再[ㄗㄞˋ] 玩[ㄨㄢˊ] 一[ㄧ] 次[ㄘˋ]" />
          </button>
        </div>
      </Layout>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <Layout stars={stars}>
      <div className="mb-6 flex items-center justify-between px-2">
        <button onClick={reset} className="text-gray-400 font-bold hover:text-gray-600 flex items-center">
          <i className="fas fa-times-circle mr-2"></i> <RubyText text="回[ㄏㄨㄟˊ] 首[ㄕㄡˇ] 頁[ㄧㄝˋ]" />
        </button>
        <div className="text-gray-500 font-black text-lg">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-4 mb-10 overflow-hidden shadow-inner">
        <div 
          className="bg-[#64DFDF] h-full transition-all duration-500 rounded-full" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {currentQuestion && (
        <QuizCard 
          question={currentQuestion} 
          onAnswer={handleAnswer} 
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
        />
      )}

      {selectedAnswer && (
        <div className="mt-10 flex justify-center">
          <button 
            onClick={nextQuestion}
            className="bg-[#64DFDF] hover:bg-[#58cece] text-white text-3xl font-black py-6 px-20 rounded-full shadow-lg transform hover:scale-105 transition-all btn-shadow-mint"
          >
            {currentIndex === questions.length - 1 ? (
              <RubyText text="看[ㄎㄢˋ] 結[ㄐㄧㄝˊ] 果[ㄍㄨㄛˇ]" />
            ) : (
              <RubyText text="下[ㄒㄧㄚˋ] 一[ㄧ] 題[ㄊㄧˊ]" />
            )}
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
