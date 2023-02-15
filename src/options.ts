import { getUseJinnaiSystem, setUseJinnaiSystem } from "./config";

const useJinnaiSystemInput = document.getElementById(
  "useJinnaiSystem"
) as HTMLInputElement;

useJinnaiSystemInput.addEventListener("change", () => {
  setUseJinnaiSystem(useJinnaiSystemInput.checked);
});

window.addEventListener("load", async () => {
  const useJinnaiSystem = await getUseJinnaiSystem();
  useJinnaiSystemInput.checked = useJinnaiSystem;
});
