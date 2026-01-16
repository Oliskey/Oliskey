import React from 'react';
import { 
  Globe, Smartphone, Code, BarChart, Layout, Brain, 
  FlaskConical, Server, GraduationCap, Video, Rocket, 
  HelpCircle 
} from 'lucide-react';

export const getIconByName = (name: string, size: number = 24): React.ReactNode => {
  const props = { size, strokeWidth: 1.5 };
  
  switch (name) {
    case 'Globe': return <Globe {...props} />;
    case 'Smartphone': return <Smartphone {...props} />;
    case 'Code': return <Code {...props} />;
    case 'BarChart': return <BarChart {...props} />;
    case 'Layout': return <Layout {...props} />;
    case 'Brain': return <Brain {...props} />;
    case 'FlaskConical': return <FlaskConical {...props} />;
    case 'Server': return <Server {...props} />;
    case 'GraduationCap': return <GraduationCap {...props} />;
    case 'Video': return <Video {...props} />;
    case 'Rocket': return <Rocket {...props} />;
    default: return <HelpCircle {...props} />;
  }
};
