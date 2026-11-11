import React from 'react';
import { EffectComposer, Bloom, ToneMapping, Vignette, SMAA } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

// Desktop finishing pass: soft bloom on lamps and screens (stronger at night), filmic AgX tone mapping, a light vignette.
const Effects: React.FC<{ night: boolean }> = ({ night }) => (
  <EffectComposer multisampling={0} enableNormalPass={false}>
    <SMAA />
    <Bloom mipmapBlur intensity={night ? 0.45 : 0.08} luminanceThreshold={night ? 1.25 : 2.2} luminanceSmoothing={0.25} radius={0.6} />
    <ToneMapping mode={ToneMappingMode.AGX} />
    <Vignette offset={0.3} darkness={night ? 0.55 : 0.35} />
  </EffectComposer>
);
export default Effects;
