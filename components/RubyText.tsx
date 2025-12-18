
import React from 'react';

interface RubyTextProps {
  text: string;
}

/**
 * Parses text in the format "字[ㄗˋ]" and converts it to <ruby>字<rt>ㄗˋ</rt></ruby>.
 * Plain text remains as is.
 */
const RubyText: React.FC<RubyTextProps> = ({ text }) => {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  // Regex to match "Character[Zhuyin]" pattern
  const regex = /([^\[\s]+)\[([^\]]+)\]|([^\s\[]+)|(\s+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[1] && match[2]) {
      // It's a character with Bopomofo, e.g., "字[ㄗˋ]"
      const chars = Array.from(match[1]);
      const zhuyins = match[2].trim().split(/\s+/);
      
      if (chars.length === zhuyins.length) {
        chars.forEach((char, idx) => {
          parts.push(
            <ruby key={`${match?.index}-${idx}`}>
              {char}
              <rt>{zhuyins[idx]}</rt>
            </ruby>
          );
        });
      } else {
        // If they don't match 1:1, render as a group
        parts.push(
          <ruby key={match.index}>
            {match[1]}
            <rt>{match[2]}</rt>
          </ruby>
        );
      }
    } else if (match[3]) {
      // It's just plain text without brackets
      parts.push(<span key={match.index}>{match[3]}</span>);
    } else if (match[4]) {
      // Preserve spaces for natural sentence flow
      parts.push(<span key={match.index}>&nbsp;</span>);
    }
  }

  return <span className="inline-flex flex-wrap items-center justify-center gap-y-2">{parts}</span>;
};

export default RubyText;
