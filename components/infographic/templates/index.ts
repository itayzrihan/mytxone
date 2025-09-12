export { ClimbingTemplate, getClimbingTemplate } from './climbing-template';
export { MorphingTemplate, getMorphingTemplate } from './morphing-template';
export { EnergyTemplate, getEnergyTemplate } from './energy-template';

export type { ClimbingTemplateProps } from './climbing-template';
export type { MorphingTemplateProps } from './morphing-template';
export type { EnergyTemplateProps } from './energy-template';

import { getClimbingTemplate } from './climbing-template';
import { getMorphingTemplate } from './morphing-template';
import { getEnergyTemplate } from './energy-template';

export type TemplateOrientation = 'horizontal' | 'vertical';

export const getTemplateByName = (name: string, orientation: TemplateOrientation = 'horizontal') => {
  switch (name) {
    case 'climbing':
      return getClimbingTemplate({ orientation });
    case 'morphing':
      return getMorphingTemplate({ orientation });
    case 'energy':
      return getEnergyTemplate({ orientation });
    default:
      return getClimbingTemplate({ orientation });
  }
};
