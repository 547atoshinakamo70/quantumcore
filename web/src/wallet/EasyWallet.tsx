import React, { useEffect, useMemo, useState } from 'react'
import { newMnemonic, isMnemonicValid, seedFromMnemonic, deriveAll, DerivedAddr } from '../lib/hd'
import { vaultSave, vaultLoad, vaultDelete } from '../lib/secure'

function Section({title, children}:{title:string, children:React.ReactNode}){
  return (
    <div className="card space-y-3">
      <div className="text-[#a9b9ff]">{title}</div>
      <div>{children}</div>
    </div>
  )
}

export default function EasyWallet(){
  const [hasVault, setHasVault] = useState(false)
  const [mnemonic, setMnemonic] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [pass, setPass] = useState('')
  const [seed, setSeed] = useState<Uint8Array|null>(null)
  const [addrs, setAddrs] = useState<DerivedAddr[]>([])
  const [index, setIndex] = useState(0)
  const [msg, setMsg] = useState<string>('')

  useEffect(()=>{ (async()=>{
    const s = await vaultLoad().catch(()=>null)
    if (s) { setHasVault(true); setSeed(s); setAddrs(deriveAll(s, 0)) }
  })() }, [])

  const onCreate = ()=>{
    const m = newMnemonic(12)
    setMnemonic(m)
    setConfirm(false)
  }
  const onSave = async()=>{
    if (!mnemonic || !isMnemonicValid(mnemonic)) { setMsg('Frase inválida'); return }
    if (!pass || pass.length < 6) { setMsg('Pon una contraseña local (>=6 caracteres)'); return }
    const s = seedFromMnemonic(mnemonic)
    const ok = await vaultSave(s, pass).catch(()=>false)
    if (ok){ setHasVault(true); setSeed(s); setAddrs(deriveAll(s, 0)); setMsg('Monedero creado y guardado localmente'); }
    else setMsg('No se pudo guardar')
  }
  const onLoad = async()=>{
    if (!pass){ setMsg('Introduce tu contraseña local'); return }
    const s = await vaultLoad(pass).catch(()=>null)
    if (!s){ setMsg('No se pudo desbloquear'); return }
    setSeed(s); setAddrs(deriveAll(s, 0)); setHasVault(true); setMsg('Desbloqueado')
  }
  const onWipe = async()=>{
    await vaultDelete(); setHasVault(false); setSeed(null); setAddrs([]); setMsg('Eliminado del dispositivo')
  }
  const onNewAddr = ()=>{
    if (!seed) return;
    const i = index+1; setIndex(i); setAddrs(deriveAll(seed, i))
  }

  return (
    <div className="space-y-6">
      {!hasVault && (
        <>
          <Section title="Crear monedero (1 clic)">
            <div className="flex gap-2">
              <button className="btn" onClick={onCreate}>Generar frase (12 palabras)</button>
            </div>
            {mnemonic && (
              <div className="mt-3">
                <div className="p-3 rounded-lg bg-[#0f1426] border border-[#1b2340]">{mnemonic}</div>
                <label className="flex gap-2 items-center mt-3">
                  <input type="checkbox" checked={confirm} onChange={e=>setConfirm(e.target.checked)}/>
                  <span>He guardado la frase en lugar seguro</span>
                </label>
                <div className="mt-3 flex gap-2">
                  <input className="input" type="password" placeholder="Contraseña local (para cifrado)"
                    value={pass} onChange={e=>setPass(e.target.value)}/>
                  <button className="btn" disabled={!confirm} onClick={onSave}>Guardar</button>
                </div>
              </div>
            )}
          </Section>

          <Section title="Restaurar monedero">
            <textarea className="input w-full" rows={2} placeholder="Introduce tu frase de 12 palabras"
              value={mnemonic} onChange={e=>setMnemonic(e.target.value)}/>
            <div className="flex gap-2">
              <input className="input" type="password" placeholder="Contraseña local (para cifrado)"
                value={pass} onChange={e=>setPass(e.target.value)}/>
              <button className="btn" onClick={onSave}>Restaurar y guardar</button>
            </div>
          </Section>

          <Section title="Desbloquear existente">
            <div className="flex gap-2">
              <input className="input" type="password" placeholder="Contraseña local"
                value={pass} onChange={e=>setPass(e.target.value)}/>
              <button className="btn" onClick={onLoad}>Desbloquear</button>
            </div>
          </Section>
        </>
      )}

      {hasVault && (
        <>
          <Section title="Direcciones derivadas (cuenta 0)">
            <div className="flex gap-2 items-center">
              <button className="btn" onClick={onNewAddr}>Nueva dirección (índice {index+1})</button>
              <button className="btn" onClick={onWipe}>Eliminar de este dispositivo</button>
            </div>
            <ul className="mt-3 space-y-2">
              {addrs.map((a,i)=>(
                <li key={i} className="p-3 rounded-lg bg-[#0f1426] border border-[#1b2340]">
                  <b className="mr-2">{a.chain.toUpperCase()}</b>
                  <code className="break-all">{a.address}</code>
                  <span className="ml-2 text-xs opacity-70">{a.path}</span>
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}

      {msg && <div className="p-3 rounded-lg bg-[#0e2a18] border border-green-700">{msg}</div>}
    </div>
  )
}
