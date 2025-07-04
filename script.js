import { annotate } from "https://unpkg.com/rough-notation?module";

const e = document.querySelector("#name");
const timeLine = document.querySelector("#time-line");
const stack = document.querySelector("#full-stack");
const creative = document.querySelector("#creative");
const annotation = annotate(e, {
  type: "box",
  color: "blue",
  iterations: 1,
  animationDuration: 1000,
});
annotation.show();


const st = annotate(stack, { type: "circle", color: "#30ffcf", animationDuration: 800 });
const c = annotate(creative, { type: "box", color: "#ff8f66", animationDuration: 800 });
const line = annotate(timeLine, { type: "underline", color: "#6e81ff", animationDuration: 800 });

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target === stack) st.show();
      if (entry.target === creative) c.show();
      if (entry.target === timeLine) line.show();

      // Optional: stop observing once shown
      obs.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5 // Adjust if needed
});

observer.observe(stack);
observer.observe(creative);
observer.observe(timeLine);



new TypeIt("#tagline", {
  speed: 90,
  loop: true,
}).go();

const imageFilenames = Array.from({ length: 14 }, (_, i) => `${i + 1}.png`);
const numImages = 30;
const placedRects = [];
const minSpacing = 60;

function isTooClose(a, b) {
  const ax = a.left + a.width / 2;
  const ay = a.top + a.height / 2;
  const bx = b.left + b.width / 2;
  const by = b.top + b.height / 2;
  const dx = ax - bx;
  const dy = ay - by;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const minDist = (a.width + b.width) / 2 + minSpacing;
  return dist < minDist;
}

window.addEventListener("load", () => {
  const footer = document.querySelector("footer");
  const footerTop = footer.getBoundingClientRect().top + window.scrollY;
  const scrollWidth = document.documentElement.scrollWidth;

  for (let i = 0; i < numImages; i++) {
    const img = document.createElement("img");
    const file =
      imageFilenames[Math.floor(Math.random() * imageFilenames.length)];
    img.src = `images/${file}`;
    img.classList.add("bg-img");

    const size = Math.floor(Math.random() * 70) + 80;
    img.style.width = `${size}px`;
    img.style.position = "absolute";
    img.style.zIndex = "-1";
    img.style.pointerEvents = "none";

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 50) {
      const posX = Math.random() * scrollWidth;

      const minY = window.innerHeight * 0.7;
      const maxY = footerTop - size;

      if (maxY <= minY) break;

      const posY = Math.random() * (maxY - minY) + minY;

      const currentRect = {
        left: posX,
        top: posY,
        width: size,
        height: size,
      };

      const tooClose = placedRects.some((prev) =>
        isTooClose(prev, currentRect)
      );

      if (!tooClose) {
        img.style.left = `${posX}px`;
        img.style.top = `${posY}px`;

        const rotation = Math.random() * 360;
        const translateX = Math.random() * 20 - 10;
        const translateY = Math.random() * 20 - 10;
        img.style.transform = `rotate(${rotation}deg) translate(${translateX}px, ${translateY}px)`;
        img.style.animation = `floatAnim 6s ease-in-out infinite`;
        img.style.animationDelay = `${Math.random() * 4}s`;

        document.body.appendChild(img);
        placedRects.push(currentRect);
        placed = true;
      }

      attempts++;
    }
  }
});
