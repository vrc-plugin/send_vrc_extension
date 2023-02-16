export async function getUseJinnaiSystem(): Promise<boolean> {
  const { useJinnaiSystem } = await chrome.storage.local.get("useJinnaiSystem");
  return useJinnaiSystem ?? false;
}

export function setUseJinnaiSystem(value: boolean): Promise<void> {
  return chrome.storage.local.set({
    useJinnaiSystem: value,
  });
}
