import { describe, it, expect, beforeEach } from 'vitest';
import { loadEntries, saveEntries, restoreEntriesBackup } from './storage.js';

function memoryStorage(){ const data=new Map(); return {getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)}; }

describe('storage',()=>{
  let storage;
  beforeEach(()=>{storage=memoryStorage()});
  it('returns empty array for missing/corrupt data',()=>{expect(loadEntries(storage)).toEqual([]);storage.setItem('pluviometro_entries','{bad');expect(loadEntries(storage)).toEqual([])});
  it('saves entries and preserves previous state as backup',()=>{saveEntries([{id:'1'}],storage);saveEntries([{id:'2'}],storage);expect(loadEntries(storage)).toEqual([{id:'2'}]);expect(restoreEntriesBackup(storage)).toEqual([{id:'1'}])});
  it('does not throw when storage write fails',()=>{const bad={getItem:()=>null,setItem:()=>{throw Error('quota')}};expect(saveEntries([],bad)).toBe(false)});
});
