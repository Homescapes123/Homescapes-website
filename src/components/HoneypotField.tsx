import React from 'react';
import { HONEYPOT_FIELD } from '../lib/enquiry';

// Invisible to people and screen readers; spam bots that fill every input get silently ignored.
export const HoneypotField: React.FC = () => (
  <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
    <label>
      Leave this field empty
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
    </label>
  </div>
);
