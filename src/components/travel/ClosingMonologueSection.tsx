import React from 'react';
import { IntroductoryBanner } from './IntroductoryBanner';

interface ClosingMonologueSectionProps {
  onExploreDestinations: () => void;
}

export const ClosingMonologueSection: React.FC<ClosingMonologueSectionProps> = (props) => {
  return <IntroductoryBanner {...props} />;
};
