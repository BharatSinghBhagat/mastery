import React from 'react';
import { QuestionCard } from './QuestionCard';

export const QuestionFeed = ({ filterProps, role }: any) => {
  return (
    <QuestionCard 
      question={filterProps.question} 
      role={role} 
      onRefresh={filterProps.onRefresh}
      index={filterProps.index}
    />
  );
};
