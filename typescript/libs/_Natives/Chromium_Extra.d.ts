
/**************************************************************************
 * Extra Chrome specific features and new APIs.
 * 
 * The contents of this file are appending to chrome_lib.d.ts.
 */
declare var CustomEvent: {
  prototype: CustomEvent;
  new(type?: string, options?:CustomEventOptions): CustomEvent;
};

declare var KeyboardEvent: {
   prototype: KeyboardEvent;
   new(typeArg?: string, init?: KeyboardEvent): KeyboardEvent;
   DOM_KEY_LOCATION_RIGHT: number;
   DOM_KEY_LOCATION_STANDARD: number;
   DOM_KEY_LOCATION_LEFT: number;
   DOM_KEY_LOCATION_NUMPAD: number;
   DOM_KEY_LOCATION_JOYSTICK: number;
   DOM_KEY_LOCATION_MOBILE: number;
};

interface Console {
  timeStamp(label: string): void;
}

interface FontFace {
  family: string;
  style: string;
  weight: string;
  stretch: string;
  unicodeRange: string;
  variant: string;
  featureSettings: string;

  status: string;

  load(): Promise<FontFace>;
  
  loaded: Promise<FontFace>;
}

interface FontFaceSet extends Set<FontFace> {
  onloading: (ev: Event) => any;
  onloadingdone: (ev: Event) => any;
  onloadingerror: (ev: Event) => any;
  
  // check and start loads if appropriate
  // and fulfill promise when all loads complete
  load(font: string, text?: string): Promise< ArrayLike<FontFace> >;
  
  // return whether all fonts in the fontlist are loaded
  // (does not initiate load if not available)
  check(font: string, text?: string): boolean;
  
  // async notification that font loading and layout operations are done
  ready: Promise<FontFaceSet>;
  
  // loading state, "loading" while one or more fonts loading, "loaded" otherwise
  status: string;
}

interface Document {
  fonts: FontFaceSet;
}