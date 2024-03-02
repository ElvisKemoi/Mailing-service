Array.from(document.querySelector(".status")).forEach(stat => {
    if (/\subscribed\b/i.test(stat.innerHTML)) {
      stat.style.color = 'red';
    }
  });