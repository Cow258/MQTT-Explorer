import * as React from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

/**
 * Outline "0101" glyph, similar to Font Awesome's regular binary icon.
 * Wider than tall so the four digits stay readable beside the Hex label.
 */
export function BinaryIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 70 32" style={{ width: '2em', height: '0.9em', ...props.style }}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8 2A7 7 0 0 0 1 9L1 23A7 7 0 0 0 8 30A7 7 0 0 0 15 23L15 9A7 7 0 0 0 8 2ZM8 5.2A3.8 3.8 0 0 1 11.8 9L11.8 23A3.8 3.8 0 0 1 8 26.8A3.8 3.8 0 0 1 4.2 23L4.2 9A3.8 3.8 0 0 1 8 5.2ZM21 7L25 2H29V26H33V30H19V26H25V8.2ZM44 2A7 7 0 0 0 37 9L37 23A7 7 0 0 0 44 30A7 7 0 0 0 51 23L51 9A7 7 0 0 0 44 2ZM44 5.2A3.8 3.8 0 0 1 47.8 9L47.8 23A3.8 3.8 0 0 1 44 26.8A3.8 3.8 0 0 1 40.2 23L40.2 9A3.8 3.8 0 0 1 44 5.2ZM57 7L61 2H65V26H69V30H55V26H61V8.2Z"
      />
    </SvgIcon>
  )
}
