import { useEffect, useState } from "preact/hooks"

interface Props {

}

function xgcd(a: number,b: number) {
    if(!a || !b) return {g: 0, x: 0, y: 0}
    if (a < b) [a,b] = [b, a];
    let s = 0, old_s = 1;
    let t = 1, old_t = 0;
    let r = b, old_r = a;
    while (r != 0) {
        let q = Math.floor(old_r/r);
        [r, old_r] = [old_r - q*r, r];
        [s, old_s] = [old_s - q*s, s];
        [t, old_t] = [old_t - q*t, t];
    }
    if(b < a) {
        // if we swapped a and b, we need to swap s and t
        [old_s, old_t] = [old_t, old_s];
        [s, t] = [t, s];
    }
    // quotient by GCD is s and t (if needed)
    return { g: old_r, x: old_s, y: old_t }
}

function diophantineValues(r, g, a, b, x1, y1): { x: number; y: number; } {
    return {x: x1-r*b/g,y: y1+r*a/g}
}

const inputStyle = {
    pattern: '\-?\d+',
    step: 1,
    className: 'inline w-10 border rounded invalid:border-red-500',
}

type SolutionType = { x: number; y: number; } | undefined
export default function LinearDiophantineEquationSolver({ }: Props) {
    const [ diophantineParams, setDiophantineParams ] = useState({ a: 5, b: 6, c: 39, r: -7 })
    const [ solution, setSolution ] = useState<SolutionType>(undefined)
    function setValue(key: keyof typeof diophantineParams, target: EventTarget) {
        const el = target as HTMLInputElement
        if(!el.validity.valid) return
        if(!el.checkValidity()) return
        setDiophantineParams({ ...diophantineParams, [key]: el.valueAsNumber })
    }
    useEffect(() => {
        let { g, x, y } = xgcd(diophantineParams.a, diophantineParams.b)
        if(diophantineParams.c % g !== 0) {
            // there are no solutions
            setSolution(undefined)
            return
        }
        const k = diophantineParams.c / g
        x *= k
        y *= k
        setSolution(diophantineValues(diophantineParams.r, g, diophantineParams.a, diophantineParams.b, x, y))
    }, [diophantineParams])
    return <form className="border rounded w-auto mx-10 my-5 p-3 flex flex-col gap-1">
        <div className="flex justify-center">
            <input type="number" value={diophantineParams.a} {...inputStyle} placeholder="a" onInput={(event: Event) => setValue('a', event.target)} />x +
            (<input type="number" value={diophantineParams.b} {...inputStyle} placeholder="b" onInput={(e) => setValue('b', e.target)} />)y
            = <input type="number" value={diophantineParams.c} {...inputStyle} placeholder="c" onInput={(e) => setValue('c', e.target)} />
        </div>
        <div className="flex justify-center">
            Řešení pro r =
            <input type="number"
            {...inputStyle}
            placeholder="r"
            value={diophantineParams.r}
            onInput={(e) => setValue('r', e.target)} />
        </div>
        <div className="flex justify-center">
            {solution && `[x; y] = [${solution.x}; ${solution.y}]` || 'Nemá řešení, neboť gcd(a, b) nedělí c.'}
        </div>
    </form>
}