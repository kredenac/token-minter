import React from 'react';
import 'react-stepi-bar/styles.css';
import { ProgressBar } from 'react-stepi-bar';

interface IProgressBarProps {
  currentStep: number;
  totalSteps: number;
}
export class StepProgressBar extends React.Component<IProgressBarProps> {
  render() {
    const { currentStep, totalSteps } = this.props;
    const percent = (currentStep * 100) / totalSteps;
    if (!currentStep) return null;

    return (
      <div>
        <span>{`${percent.toFixed(0)}%`}</span>
        <ProgressBar
          percent={percent}
          filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
        />
      </div>
    );
  }
}
