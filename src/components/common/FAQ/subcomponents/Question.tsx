'use client';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

interface QuestionProps {
  question: string;
  answer: string;
}
const Question = ({ question, answer }: QuestionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="w-full py-6 pr-6 border-b flex flex-col cursor-pointer" onClick={toggleIsOpen}>
      <div className='flex justify-between items-center'>
        <h1 className="text-xl lg:text-3xl unbounded">{question}</h1>
        <Plus className='shrink-0' />
      </div>
      <label className={`my-4 ${isOpen ? 'visible' : 'hidden'}`}>{answer}</label>
    </div>
  );
}

export default Question;