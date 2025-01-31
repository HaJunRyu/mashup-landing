import { useCallback, useRef, useState } from 'react';
import { useWindowScroll } from '@utils/hooks/useWindow';
import { motion } from 'framer-motion';
import cc from 'classcat';
import IMG_LOGO from '@resources/images/logo.png';
import IMG_LOGO_TITLE from '@resources/svg/logo-title.svg';
import { collectGaEvent } from '@utils/google';
import S from './styles.module.scss';
import RecruitingBanner from '../RecruitingBanner';

const useAnimatedHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const latestScrollYRef = useRef<number>();

  useWindowScroll(
    ({ scroll }) => {
      const offset = 12;
      const isHeroPosition = scroll <= 100;
      const isSwipeUp = !isVisible && latestScrollYRef.current - offset > scroll;
      const isSwipeDown = isVisible && latestScrollYRef.current < scroll - offset;
      if (isHeroPosition || isSwipeUp) {
        setIsVisible(true);
      } else if (isSwipeDown) {
        setIsVisible(false);
      }
      latestScrollYRef.current = scroll;
    },
    [isVisible],
  );

  return { isVisible };
};

const Header = () => {
  const { isVisible } = useAnimatedHeader();
  const onNavigateTo = useCallback((event, target: string) => {
    event.preventDefault();
    const element = document.getElementById(target);
    const top = element?.getBoundingClientRect().top;
    const offset = window.pageYOffset;
    window.scrollTo(0, Math.max(offset + top, 0));

    collectGaEvent(`헤더_${target}_선택`);
  }, []);

  return (
    <motion.div
      className={cc([S.HeaderContainer, isVisible && S.isVisible])}
      animate={{ y: isVisible ? '0%' : '-100%' }}
    >
      <div className={S.Header}>
        <a className={S.logo} href="/">
          <img className={S.LogoImage} src={IMG_LOGO} alt="매쉬업 로고" width={32} height={32} />
          <img className={S.LogoImage} src={IMG_LOGO_TITLE} alt="매쉬업 로고" />
        </a>
        <div className={S.menu}>
          <a className={S.MenuItem} href="#" onClick={(event) => onNavigateTo(event, 'program')}>
            program
          </a>
          <a className={S.MenuItem} href="#" onClick={(event) => onNavigateTo(event, 'team')}>
            team
          </a>
          <a className={S.MenuItem} href="#" onClick={(event) => onNavigateTo(event, 'works')}>
            works
          </a>
          <a
            className={S.MenuItem}
            href="#"
            onClick={(event) => onNavigateTo(event, 'partnership')}
          >
            partners
          </a>
          <a
            className={S.MenuButton}
            href="https://recruit.mash-up.kr"
            target="_blank"
            rel="noreferrer"
          >
            JOIN US! →
          </a>
        </div>
      </div>{' '}
      <RecruitingBanner />
    </motion.div>
  );
};

export default Header;
