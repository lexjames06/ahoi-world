"use client";

export function SeedData() {
  const seedData = async () => {
    const url = "/seed/api";
    console.log({url})
    const { message } = await fetch(url).then((res) => res.json());
    console.log({message});
  };

  return (
    <button style={{
      backgroundColor: "var(--button-background)",
      padding: "1rem",
      borderRadius: "0.25rem",
      color: "var(--button-text)",
      fontWeight: "bold",
      cursor: "pointer",
    }} onClick={seedData}>
      Add Data
    </button>
  );
};