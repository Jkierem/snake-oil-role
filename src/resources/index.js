import { Maybe } from '@juan-utils/structures'
import { prop, integerRandom } from '@juan-utils/functions';
import rolesJSON from './roles.json'

export const roles = rolesJSON.data;
export const getRole = (n) => Maybe.from(prop(n,roles));
export const randomRole = (random=integerRandom) => getRole(random(roles.length))
export const nonRepeatingRandomRoll = (() => {
    let rs = [...roles];
    const gen = () => {
        const i = integerRandom(rs.length);
        const role = rs[i];
        rs = rs.filter((x,index) => index !== i );
        return Maybe.from(role);
    }
    gen.reset = () => rs = [...roles];
    gen.remaining = () => rs.length;
    return gen;
})()
