import Head from 'next/head'
import Image from 'next/image'
import { Space_Grotesk, Permanent_Marker, Noto_Sans } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import {
  animated,
  useSpring,
  config,
  useSpringRef,
  useChain
} from "react-spring";
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Link from 'next/link'
import React from 'react'
import { database } from '@/firebase/firebaseClient'
import { ref, set } from 'firebase/database'
import { v4 } from "uuid"

const spaceGrotesk700 = Space_Grotesk({ subsets: ['latin'], weight: "700" })
const spaceGrotesk600 = Space_Grotesk({ subsets: ['latin'], weight: "600" })
const permanentMarker400 = Permanent_Marker({ subsets: ['latin'], weight: "400" })
const notoSans400 = Noto_Sans({ subsets: ['latin'], weight: "400" })
const notoSans700 = Noto_Sans({ subsets: ['latin'], weight: "700" })

export default function Home() {

  const [slideBottom, setSlideBottom] = useState('100%')
  const [slideTop, setSlideTop] = useState('40%')
  const [slideTopShort, setSlideTopShort] = useState('10%')
  const [slideOpacity, setSlideOpacity] = useState('0')
  const [validationError, setValidationError] = useState(false)
  const [email, setEmail] = useState('')
  const [savedSuccessfully, setSavedSuccessfully] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(false)
  useEffect(() => {
    setSlideBottom('0')
    setSlideTop('0')
    setSlideTopShort('0')
    setSlideOpacity('1')
  }, []);

  const writeInDataBase = (email: string) => {
    setDisableSubmit(true)
    const referenceDb = ref(database, `subscribers/${v4()}`);
    set(referenceDb, {
      email
    })
      .then(() => {
        setSavedSuccessfully(true)
      })
      .catch((error) => {
        // The write failed...
      });
  };

  const [isHovering, setIsHovered] = useState(false);
  const onMouseEnter = () => setIsHovered(true);
  const onMouseLeave = () => setIsHovered(false);

  const [isHoveringSubmit, setIsHoveredSubmit] = useState(false);
  const onMouseEnterSubmit = () => setIsHoveredSubmit(true);
  const onMouseLeaveSubmit = () => setIsHoveredSubmit(false);

  const [isChecked, setIsChecked] = useState(false);
  const checkboxAnimationRef = useSpringRef();
  const checkboxAnimationStyle = useSpring({
    backgroundColor: isChecked ? "#030303" : "#FCD0F4",
    border: "2px #030303 solid",
    borderColor: validationError ? "#FF6464" : "#030303",
    config: config.gentle,
    ref: checkboxAnimationRef
  });

  const [checkmarkLength, setCheckmarkLength] = useState(null);

  const checkmarkAnimationRef = useSpringRef();
  const checkmarkAnimationStyle = useSpring({
    x: isChecked ? 0 : checkmarkLength,
    config: config.gentle,
    ref: checkmarkAnimationRef
  });

  useChain(
    isChecked
      ? [checkboxAnimationRef, checkmarkAnimationRef]
      : [checkmarkAnimationRef, checkboxAnimationRef],
    [0, 0.1]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(!isChecked)
    isChecked && writeInDataBase(email)
    isChecked && setEmail('')
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container sx={{ flexGrow: 1, backgroundColor: '#FCD0F4', height: "100%" }} className={styles.main2}>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Grid container className={styles.main}
            sx={{ flexGrow: 1, backgroundColor: '#030303' }}
            justifyContent="center"
          // alignItems="center"
          >

            <Box className={styles.slide_down} sx={{ background: "#FCD0F4" }}>
              <Box
                className={styles.hide_slide_down}
                sx={{
                  borderBottom: '1px solid #FCD0F4',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  height: '6rem',
                  bottom: slideBottom,
                  background: "#030303"
                }}
              >
                <div className={`${styles.logo_title_wrapper}`}>
                  <Box sx={{ position: 'relative', padding: '2rem', marginRight: '2rem', marginLeft: '0.5rem' }} className={styles.height6}>
                    <Image
                      src="/word_search_maze_logo.svg"
                      alt="Word Search Maze"
                      fill
                      sizes="(max-width: 70px) 100vw,
                (max-width: 58px) 50vw"
                    />
                  </Box>
                  <h2 className={spaceGrotesk700.className}>Enjoy Word Search, Create Your Book and Sell It!</h2>
                </div>
              </Box>
            </Box>
            <Box className={styles.slide}>
              <Box className={styles.hid_slide} sx={{ top: slideTop }}>
                <Box className={`${styles.yellow_background}`} sx={{ opacity: slideOpacity }}>
                  <div className={styles.smile_wrapper}>
                    <Box sx={{ position: 'relative', padding: '2.5rem' }}>
                      <Image
                        src="/smile.svg"
                        alt="Word Search Maze"
                        fill
                        sizes="(max-width: 70px) 100vw,
                  (max-width: 58px) 50vw"
                      // width={45}
                      // height={62}
                      />
                    </Box>
                  </div>
                  <div className={styles.why_wrapper}>
                    <span className={`${permanentMarker400.className} ${styles.marker_title} ${styles.pink_marker}`}>{"  Why us?"}</span>
                    <p className={`${notoSans400.className} ${styles.body_text} ${styles.margin_bottom_15}`}>{"We're working on the best and easiest word search builder and we're almost done."} </p>
                    <h3 className={`${notoSans700.className}`}>Our features:</h3>
                    <div>
                      <List>
                        <ListItem className={styles.padding_bottom_1}>
                          <ListItemIcon sx={{ minWidth: '1.5rem', marginRight: '1rem' }}>
                            <Box sx={{ position: 'relative', padding: '0.7rem' }}>
                              <Image
                                src="/check.svg"
                                alt="Word Search Maze"
                                fill
                              // width={24}
                              // height={24}
                              />
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            disableTypography
                            primary={<p className={`${notoSans400.className} ${styles.body_text}`}>Create word search books and sell them on Amazon.</p>}
                          />
                        </ListItem>
                        <ListItem className={styles.padding_bottom_1}>
                          <ListItemIcon sx={{ minWidth: '1.5rem', marginRight: '1rem' }}>
                            <Box sx={{ position: 'relative', padding: '0.7rem' }}>
                              <Image
                                src="/check.svg"
                                alt="Word Search Maze"
                                fill
                              // width={24}
                              // height={24}
                              />
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            disableTypography
                            primary={<p className={`${notoSans400.className} ${styles.body_text}`}>Create fun and exciting learning materials in minutes.</p>}
                          />
                        </ListItem>
                        <ListItem className={styles.padding_bottom_1}>
                          <ListItemIcon sx={{ minWidth: '1.5rem', marginRight: '1rem' }}>
                            <Box sx={{ position: 'relative', padding: '0.7rem' }}>
                              <Image
                                src="/check.svg"
                                alt="Word Search Maze"
                                fill
                              // width={24}
                              // height={24}
                              />
                            </Box>
                          </ListItemIcon>
                          <ListItemText
                            disableTypography
                            primary={<p className={`${notoSans400.className} ${styles.body_text}`}>Organize themed house parties with exciting word search games.</p>}
                          />
                        </ListItem>,
                      </List>
                    </div>
                  </div>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* </Slide> */}

        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Grid
            container className={styles.main}
            // xs={12} sm={12} md={12} lg={6}
            sx={{ flexGrow: 1, backgroundColor: '#FCD0F4' }}
            direction="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box className={styles.slide_down}>
              <Box
                className={`${styles.height6} ${styles.hide_slide_down}`}
                sx={{
                  borderBottom: '1px solid #030303',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  bottom: slideBottom,
                }}>
                <div className={styles.logo_title_wrapper}>
                  <h1 className={spaceGrotesk600.className}>Subscribe Us</h1>
                </div>
              </Box>
            </Box>
            {/* <Grid item xs={12}> */}
            {/* <hr className={styles.hr_style}></hr> */}
            {/* </Grid> */}
            <Box className={styles.slide_short}>
              <Box className={styles.hid_slide_short} sx={{ top: slideTopShort }}>
                <div className={styles.subscribe_block_wrapper}>
                  <div className={styles.waiting_titles_wrapper}>
                    <span className={`${permanentMarker400.className} ${styles.marker_title} ${styles.yellow_marker}`}>
                      {savedSuccessfully
                        ? ' Thanks for subscribing!'
                        : ' while you’re waiting ...'
                      }
                    </span>
                    <p className={`${notoSans400.className} ${styles.body_text} ${styles.margin_bottom_15}`}>
                      {savedSuccessfully
                        ? 'Our aim is to provide valuable content to keep you informed and knowledgeable. Exciting things ahead!'
                        : "Leave your email below and we'll inform you when our amazing platform is live!"
                      }
                    </p>
                  </div>
                  {!savedSuccessfully &&
                  <>
                  <div className={styles.inputWithButton}>
                    <form onSubmit={(e) => handleSubmit(e)}>
                      <input
                        type="email"
                        className={styles.text_input}
                        placeholder='Leave your email here'
                        onChange={(e) => setEmail(e.target.value)}
                        // onSubmit={() => handleSubmit()}
                        value={email}
                      />
                      <button
                        type="submit"
                        disabled={disableSubmit}
                        className={styles.submit_button}
                        onMouseEnter={onMouseEnterSubmit}
                        onMouseLeave={onMouseLeaveSubmit}
                        style={{opacity: disableSubmit ? '0.4' : '1'}}
                      // onClick={() => handleSubmit()}
                      >
                        {isHoveringSubmit ?
                          <Image
                            src="/arrow_black.svg"
                            alt="Word Search Maze"
                            fill
                          />
                          :
                          <Image
                            src="/arrow.svg"
                            alt="Word Search Maze"
                            fill
                          />
                        }
                      </button>
                    </form>
                  </div>
                  <div className={styles.checkbox_label_wrapper}>
                    <label className={styles.margin_right_1}>
                      <input
                        className={styles.checkbox_input}
                        type="checkbox"
                        onChange={() => {
                          setIsChecked(!isChecked)
                          setValidationError(false)
                        }}
                      />
                      <animated.svg
                        style={checkboxAnimationStyle}
                        className={styles.checkbox}
                        aria-hidden="true"
                        viewBox="0 0 15 11"
                        fill="none"
                        height={isChecked ? '2rem' : '1.6rem'}
                        width={isChecked ? '2rem' : '1.6rem'}
                      >
                        <animated.path
                          d="M1 4.5L5 9L14 1"
                          strokeWidth="1"
                          stroke="#FFFF48"
                          ref={(ref) => {
                            if (ref) {
                              // @ts-ignore
                              setCheckmarkLength(ref.getTotalLength());
                            }
                          }}
                          // @ts-ignore
                          strokeDasharray={checkmarkLength}
                          // @ts-ignore
                          strokeDashoffset={checkmarkAnimationStyle.x}
                        />
                      </animated.svg>
                    </label>
                    <p onClick={() => {
                      setIsChecked(!isChecked);
                    }}
                      className={`${notoSans400.className} ${styles.small_body_text}`}
                      style={{ color: validationError ? "#FF6464" : "#030303" }}
                    >
                      Yor personal data will be used to support your experience throughout this
                      website and for other purposes described in our&nbsp;
                      <Link
                        href='/'
                        className={`${notoSans400.className} ${styles.small_body_text}`}
                        style={{ color: validationError ? "#FF6464" : "#030303" }}
                      >
                        Terms & Privacy policy
                      </Link>
                    </p>
                  </div>
                  </>
}
                </div>
              </Box>
            </Box>

            <Box className={styles.slide_short}>
              <Box className={styles.hid_slide_short} sx={{ top: slideTopShort }}>
                <Link href='/' className={styles.text_decoration_none}>
                  <div
                    className={styles.social_wrapper}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                  >
                    {isHovering ?
                      <button type="submit" className={`${styles.social_button} ${styles.social_button_hover}`}>
                        <Image
                          src="/tiktok_black.svg"
                          alt="Word Search Maze"
                          fill
                        />
                      </button>
                      :
                      <button type="submit" className={`${styles.social_button}`}>
                        <Image
                          src="/tiktok_yellow.svg"
                          alt="Word Search Maze"
                          fill
                        />
                      </button>
                    }
                    <h3 className={`${notoSans700.className}`}>Tik Tok</h3>
                  </div>
                </Link>
              </Box>
            </Box>

          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
