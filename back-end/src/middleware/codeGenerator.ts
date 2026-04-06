import * as nanoid from 'nanoid'

export const codeGenerator = nanoid.customAlphabet('0123456789', 4);