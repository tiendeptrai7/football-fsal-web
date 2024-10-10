import { v4 as uuidv4 } from 'uuid';

export const getFirstCharacter = (text: string): string => {
  const matches = text.match(/\b(\w)/g);
  return (matches?.join('') || '')?.toUpperCase();
};
export const uuid = (): string => {
  return uuidv4();
};
export function upperCaseFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
