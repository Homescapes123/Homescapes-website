import React, { useEffect, useState, useRef } from 'react';
import { Trophy, CheckCircle, Award, Sparkles } from 'lucide-react';

export const StatisticsSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const [countProjects, setCountProjects] = useState(0);
  const [countYears, setCountYears] = useState(0);
  const [countSatisfaction, setCountSatisfaction] = useState(0);
  const [countAwards, setCountAwards] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 50;
    const intervalTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCountProjects(Math.floor(progress * 40));
      setCountYears(Math.floor(progress * 3));
      setCountSatisfaction(Math.floor(progress * 98));
      setCountAwards(Math.floor(progress * 12));

      if (step >= steps) {
        clearInterval(timer);
        setCountProjects(40);
        setCountYears(3);
        setCountSatisfaction(98);
        setCountAwards(12);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section
      ref={sectionRef}
      id="statistics-section"
      className="py-20 bg-[#1F1F1F] text-white transition-colors duration-300 relative overflow-hidden"
    >
      {/* Background Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          
          {/* Stat 1 */}
          <div className="space-y-3 pt-6 md:pt-0">
            <div className="w-12 h-12 border border-[#B58E5B]/40 bg-[#B58E5B]/10 mx-auto flex items-center justify-center text-[#E6C894]">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="font-serif text-4xl sm:text-6xl font-normal gold-gradient-text">
              {countProjects}+
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-300 font-light">
              Projects Completed
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-3 pt-6 md:pt-0">
            <div className="w-12 h-12 border border-[#B58E5B]/40 bg-[#B58E5B]/10 mx-auto flex items-center justify-center text-[#E6C894]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="font-serif text-4xl sm:text-6xl font-normal gold-gradient-text">
              {countYears}+
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-300 font-light">
              Years Experience
            </p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-3 pt-6 md:pt-0">
            <div className="w-12 h-12 border border-[#B58E5B]/40 bg-[#B58E5B]/10 mx-auto flex items-center justify-center text-[#E6C894]">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="font-serif text-4xl sm:text-6xl font-normal gold-gradient-text">
              {countSatisfaction}%
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-300 font-light">
              Client Satisfaction
            </p>
          </div>

          {/* Stat 4 */}
          <div className="space-y-3 pt-6 md:pt-0">
            <div className="w-12 h-12 border border-[#B58E5B]/40 bg-[#B58E5B]/10 mx-auto flex items-center justify-center text-[#E6C894]">
              <Award className="w-6 h-6" />
            </div>
            <div className="font-serif text-4xl sm:text-6xl font-normal gold-gradient-text">
              {countAwards}+
            </div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-300 font-light">
              Design Awards
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
