import { unflattenObject } from '../utils';

console.log(unflattenObject({
    'a.b.c': '1',
    'a.b.d': '2',
    'a.b.e': '3',
    'a.b.f': '4',
    'a.b.g.l.d': '5',
})  )