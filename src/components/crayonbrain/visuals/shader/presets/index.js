import { RIPPLES_PRESET } from './geometryPresets';

const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const deriveUniformNames = (preset) => {
  const paramUniforms = Object.keys(preset.params).map((key) => `u_${key}`);
  const colorUniforms = Object.keys(preset.colors).map((key) => `u_color${capitalize(key)}`);
  return ['u_resolution', 'u_time', ...paramUniforms, ...colorUniforms, ...(preset.extraUniforms ?? [])];
};

export const SHADER_PRESETS = [{
  ...RIPPLES_PRESET,
  uniformNames: deriveUniformNames(RIPPLES_PRESET),
}];

const PRESET_BY_ID = new Map(SHADER_PRESETS.map((preset) => [preset.id, preset]));

export const DEFAULT_SHADER_PRESET = SHADER_PRESETS[0].id;

export const getShaderPreset = (id) => PRESET_BY_ID.get(id) ?? SHADER_PRESETS[0];
