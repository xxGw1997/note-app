import { flushSync } from "react-dom";
import { SunIcon, MoonIcon } from 'lucide-react'

import { useTheme } from './theme-provider'
import { Button } from './ui/button'

// @ts-expect-error experimental API
const isAppearanceTransition =  document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = async () => {
    if (!isAppearanceTransition) {
      if (theme === "light") {
        setTheme("dark");
      } else {
        setTheme("light");
      }
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        if (theme === "light") {
          setTheme("dark");
        } else {
          setTheme("light");
        }
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {},
        {
          duration: 500,
          easing: "ease-in",
          pseudoElement:
            theme === "dark"
              ? "::view-transition-old(root)"
              : "::view-transition-new(root)",
        }
      );
    });
  }

  return (
    <Button onClick={toggleTheme} variant="ghost" size="icon" className="cursor-pointer">
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}

export default ThemeSwitch
