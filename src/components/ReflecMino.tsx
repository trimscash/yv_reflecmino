import React, { useCallback, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Button, Divider, Fab, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { gh_dark as theme } from '../theme/gh_dark';
import { generate } from '../puzzle/generate';
import Measure from 'react-measure'
import { PuzzleData, puzzle_initial_data } from '../puzzle/const';
import Canvas from './Canvas';
import icon_img from '../images/icon.png';
import h2p1_img from '../images/howtoplay_1.png';
import Timer from './Timer';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { format, isBefore } from 'date-fns';
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ShareIcon from '@mui/icons-material/Share'
import HomeIcon from '@mui/icons-material/Home'

const ReflecMino = (): JSX.Element => {

    const [date, setDate] = useState<Date>(new Date());
    const HandleDayChange = useCallback(
        (value: Date | null) => {
            if (!Number.isNaN(value?.getTime()) && value !== null) {
                const new_date = isBefore(value, new Date()) ? value : new Date();
                console.log(format(new_date, "yyyyMMdd"));
                setDate(new_date);
            }
        }, []
    );
    const [puzzle_data, setPuzzleData] = useState<PuzzleData>(puzzle_initial_data);
    const [solved, setSolved] = useState<boolean>(false);

    const [size, setSize] = useState<{ x: number, y: number }>({ x: 100, y: 100 });
    const onResize = useCallback(
        ({ bounds }: { bounds?: { width?: number, height?: number } }) => {
            setSize({
                x: bounds?.width ?? 0,
                y: bounds?.height ?? 0
            });
        }, []
    );

    const copy_result_to_clipboard = useCallback(
        () => {
            const text = [
                `⬛🟧⬛ ReflecMino ${format(date, "yyyy/MM/dd")}`,
                `🟧⬜🟦 https://yavu.github.io/yv_reflecmino/`,
                `⬛🟦⬛ Solved in ${document.getElementById("timer")?.textContent}`,
            ].join("\n");
            navigator.clipboard.writeText(text)
                .then(function () {
                    console.log("Async: Copying to clipboard was successful");
                }, function (err) {
                    console.error("Async: Could not copy text: ", err);
                });
        }, [date]
    );

    const return_to_top = useCallback(
        () => {
            if (size.x > size.y) {

                setPlaying(false);
                window.setTimeout(() => {
                    setPuzzleData(puzzle_initial_data);
                    setSolved(false);
                    setTimerEnabled(false);
                }, 600);
            }
            else {
                window.location.reload();
            }
        }, [size]
    )

    const [playing, setPlaying] = useState<boolean>(false);
    const [timer_enabled, setTimerEnabled] = useState<boolean>(false);
    const game_start = useCallback(
        () => {
            setPuzzleData(generate(Number(format(date, "yyyyMMdd"))));
            setPlaying(true);
            setTimerEnabled(true);
        }, [date]
    );

    const [how2play_visible, setHow2PlayVisible] = useState<boolean>(false);
    const toggle_how2play = useCallback(
        () => {
            setHow2PlayVisible(!how2play_visible);
        }, [how2play_visible]
    );

    return (
        <>
            <header>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
                />
            </header>
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Box
                        width={theme.spacing(43)}
                        margin={`${theme.spacing(1)} auto`}
                        sx={{
                            "@media screen and (max-width:704px)": {
                                width: theme.spacing(22)
                            }
                        }}>
                        <Typography
                            variant={"h4"}
                            marginLeft={theme.spacing(0.5)}
                        >
                            ReflecMino
                        </Typography>
                        <Divider
                            sx={{
                                marginTop: theme.spacing(0.5),
                                marginBottom: theme.spacing(1)
                            }}
                        />
                        < Grid
                            container
                            direction={"column"}
                            flex-wrap={"nowrap"}
                            justifyContent={"flex-start"}
                            alignItems={"flex-end"}
                            alignContent={"center"}
                        >
                            <Typography
                                zIndex={"1"}
                                variant={"h4"}
                                color={"#ffffff"}
                                textAlign={"center"}
                                display={timer_enabled ? "none" : "block"}
                                height={"46px"}
                                width={"146px"}
                                paddingTop={"4px"}
                                marginTop={"153.4px"}
                                marginRight={"439px"}
                                borderRadius={"2px"}
                                position={"absolute"}
                                sx={{
                                    backgroundColor: "#32373f",
                                    "@media screen and (max-width:704px)": {
                                        marginTop: "441.2px",
                                        marginRight: "103px"
                                    }
                                }}
                            >
                                Pause
                            </Typography>
                            <Paper
                                elevation={5}
                                sx={{
                                    zIndex: "3",
                                    padding: theme.spacing(1),
                                    marginTop: theme.spacing(1),
                                    marginRight: theme.spacing(1),
                                    position: "absolute",
                                    width: theme.spacing(20),
                                    height: theme.spacing(20),
                                    display: solved ? "block" : "none",
                                    boxShadow: solved ? undefined : "none",
                                    backgroundImage: "linear-gradient(135deg, rgba(255, 128, 30, 1) 15%, rgba(119, 131, 149, 1) 50%, rgba(0, 153, 255, 1) 85%)",
                                    "@media screen and (max-width:704px)": {
                                        width: theme.spacing(22),
                                        height: theme.spacing(16),
                                        marginLeft: 0,
                                        marginRight: 0,
                                        marginBottom: theme.spacing(1),
                                    },
                                }}
                            />
                            <Paper
                                elevation={5}
                                sx={{
                                    zIndex: "3",
                                    padding: theme.spacing(1),
                                    marginTop: theme.spacing(1),
                                    marginRight: theme.spacing(1),
                                    position: "absolute",
                                    width: theme.spacing(20),
                                    height: theme.spacing(20),
                                    display: playing || solved ? "block" : "none",
                                    boxShadow: solved ? "none" : undefined,
                                    backgroundColor: solved ? "#00000000" : undefined,
                                    transition: "background-color 1s",
                                    "@media screen and (max-width:704px)": {
                                        position: "static",
                                        width: theme.spacing(22),
                                        height: theme.spacing(16),
                                        marginLeft: 0,
                                        marginRight: 0,
                                        marginBottom: theme.spacing(1),
                                    },
                                }}
                            >
                                < Grid
                                    container
                                    direction={"column"}
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                >
                                    <Timer
                                        enabled={timer_enabled && !solved}
                                        theme={theme}
                                        solved={solved}
                                        playing={playing}
                                    />
                                    <Fab
                                        variant={"extended"}
                                        color={"primary"}
                                        sx={{
                                            zIndex: "1",
                                            display: solved ? "none" : "inline-flex",
                                            height: theme.spacing(2),
                                            padding: "0",
                                            backgroundColor: "#d9dde0",
                                            borderRadius: "0 0 4px 4px",
                                            "&:hover": {
                                                backgroundColor: "#40c0ff"
                                            }
                                        }}
                                        onClick={useCallback(() => setTimerEnabled(!timer_enabled), [timer_enabled])}
                                    >
                                        <PauseIcon
                                            sx={{
                                                display: timer_enabled ? "inline-block" : "none",
                                                width: theme.spacing(12),
                                                margin: "0 auto",
                                                color: "#32373f"
                                            }}
                                        />
                                        <PlayArrowIcon
                                            sx={{
                                                display: timer_enabled ? "none" : "inline-block",
                                                width: theme.spacing(12),
                                                margin: "0 auto",
                                                color: "#32373f"
                                            }}
                                        />
                                    </Fab>
                                    <Typography
                                        variant={"h6"}
                                        color={"#778395FF"}
                                        textAlign={"center"}
                                        display={solved ? "block" : "none"}
                                        height={theme.spacing(2)}
                                        width={theme.spacing(12)}
                                        padding={"auto"}
                                        borderRadius={"0 0 4px 4px"}
                                        sx={{
                                            backgroundColor: "#ffffff"
                                        }}
                                    >
                                        Solved
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        marginTop={theme.spacing(1)}
                                    >
                                        Challenge for
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                    >
                                        {format(date, "yyyy/MM/dd")}
                                    </Typography>
                                </Grid>
                            </Paper>
                            <Paper
                                elevation={5}
                                sx={{
                                    padding: theme.spacing(1),
                                    width: theme.spacing(43),
                                    height: playing && solved ? theme.spacing(22) : theme.spacing(32.65),
                                    transition: "height 1s",
                                    "@media screen and (max-width:704px)": {
                                        width: theme.spacing(22),
                                        marginLeft: 0,
                                        marginRight: 0
                                    }
                                }}
                            >
                                <Measure bounds onResize={onResize}>
                                    {({ measureRef }) => (
                                        <Box
                                            ref={measureRef}
                                            width={"100%"}
                                            height={"100%"}
                                        >
                                            <Box
                                                zIndex={2}
                                                position={"absolute"}
                                                width={size.x}
                                                height={size.y}
                                                display={solved ? "block" : "none"}
                                            />
                                            <Canvas
                                                width={size.x}
                                                height={size.y}
                                                puzzle_data={puzzle_data}
                                                setPuzzleData={setPuzzleData}
                                                setSolved={setSolved}
                                                timer_enabled={timer_enabled}
                                            />
                                        </Box>
                                    )}
                                </Measure>
                            </Paper>
                            <Paper
                                elevation={5}
                                sx={{
                                    zIndex: "5",
                                    padding: theme.spacing(1),
                                    width: theme.spacing(43),
                                    height: theme.spacing(32.65),
                                    position: "absolute",
                                    boxShadow: "none",
                                    visibility: how2play_visible ? "visible" : "hidden",
                                    opacity: how2play_visible ? "1" : "0",
                                    transition: "opacity 0.6s, visibility 0.6s",
                                    "@media screen and (max-width:704px)": {
                                        width: theme.spacing(22),
                                        marginLeft: 0,
                                        marginRight: 0
                                    }
                                }}
                            >
                                < Grid
                                    container
                                    direction={"column"}
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                >
                                    <Typography
                                        variant="h3"
                                        marginTop={theme.spacing(2)}
                                    >
                                        HowToPlay
                                    </Typography>
                                    < Grid
                                        container
                                        direction={"column"}
                                        flexWrap={"nowrap"}
                                        justifyContent={"flex-start"}
                                        alignItems={"center"}
                                        width={theme.spacing(18)}
                                        height={theme.spacing(20)}
                                        sx={{
                                            overflowY:"scroll"
                                        }}
                                    >
                                        <Box
                                            width={theme.spacing(17)}
                                            minHeight={theme.spacing(8.5)}
                                            overflow={"hidden"}
                                        >
                                            <img
                                                src={h2p1_img}
                                                alt={""}
                                                width={theme.spacing(17)}
                                                style={{
                                                    borderRadius:"2px"
                                                }}
                                            />
                                        </Box>
                                        <Typography
                                            variant="h6"
                                            marginTop={theme.spacing(1)}
                                        >
                                            Reflect the laser to illminate all the boxes.<br />
                                            aaaaa aaaaa aaaaa aaaaa aaaaa aaaaa aaaaa <br />
                                            aaaaa aaaaa aaaaa aaaaa aaaaa aaaaa aaaaa <br />
                                            aaaaa aaaaa aaaaa aaaaa aaaaa aaaaa aaaaa <br />
                                            aaaaa aaaaa aaaaa aaaaa aaaaa aaaaa aaaaa <br />
                                        </Typography>
                                    </Grid>
                                    <Button
                                        disabled={playing || solved}
                                        variant={"outlined"}
                                        size={"large"}
                                        sx={{
                                            width: theme.spacing(10),
                                            marginTop: theme.spacing(1),
                                            color: "#ffffff",
                                            borderColor: "#ffffff",
                                            "&:hover": {
                                                color: "#40c0ff",
                                            }
                                        }}
                                        onClick={toggle_how2play}
                                    >
                                        Close
                                    </Button>
                                </Grid>
                            </Paper>
                            <Paper
                                elevation={5}
                                sx={{
                                    zIndex: "4",
                                    padding: theme.spacing(1),
                                    width: theme.spacing(43),
                                    height: theme.spacing(32.65),
                                    position: "absolute",
                                    boxShadow: "none",
                                    visibility: playing ? "hidden" : "visible",
                                    opacity: playing ? "0" : "1",
                                    transition: "opacity 0.6s, visibility 0.6s",
                                    "@media screen and (max-width:704px)": {
                                        width: theme.spacing(22),
                                        marginLeft: 0,
                                        marginRight: 0
                                    }
                                }}
                            >
                                < Grid
                                    container
                                    direction={"column"}
                                    justifyContent={"flex-start"}
                                    alignItems={"center"}
                                >
                                    <Box
                                        width={theme.spacing(5)}
                                        height={theme.spacing(5)}
                                        marginTop={theme.spacing(3)}
                                    >
                                        <img
                                            src={icon_img}
                                            alt={"icon"}
                                            width={"100%"}
                                            height={"100%"}
                                            />
                                    </Box>
                                    <Typography
                                        variant="h3"
                                        marginTop={theme.spacing(2)}
                                    >
                                        ReflecMino
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            disabled={playing || solved}
                                            format={"yyyy/MM/dd"}
                                            slotProps={{
                                                textField: {
                                                    variant: 'outlined',
                                                    size: 'small'
                                                },
                                            }}
                                            sx={{
                                                width: theme.spacing(14),
                                                marginTop: theme.spacing(2),
                                            }}
                                            value={date}
                                            maxDate={new Date()}
                                            onChange={HandleDayChange}
                                        />
                                    </LocalizationProvider>
                                    <Button
                                        disabled={playing || solved}
                                        variant={"contained"}
                                        size={"large"}
                                        sx={{
                                            width: theme.spacing(10),
                                            marginTop: theme.spacing(3),
                                            backgroundColor: "#ffffff",
                                            "&:hover": {
                                                backgroundColor: "#40c0ff",
                                            }
                                        }}
                                        onClick={game_start}
                                    >
                                        Play
                                    </Button>
                                    <Button
                                        disabled={playing || solved}
                                        variant={"outlined"}
                                        size={"large"}
                                        sx={{
                                            width: theme.spacing(10),
                                            marginTop: theme.spacing(1),
                                            color: "#ffffff",
                                            borderColor: "#ffffff",
                                            "&:hover": {
                                                color: "#40c0ff",
                                            }
                                        }}
                                        onClick={toggle_how2play}
                                    >
                                        How to play
                                    </Button>
                                </Grid>
                            </Paper>
                            <Paper
                                elevation={5}
                                sx={{
                                    overflow: "hidden",
                                    width: theme.spacing(43),
                                    padding: `${playing && solved ? theme.spacing(1) : "0px"} ${theme.spacing(1)}`,
                                    height: playing && solved ? theme.spacing(4.5) : "0px",
                                    marginTop: theme.spacing(1),
                                    marginBottom: playing && solved ? theme.spacing(1) : "0px",
                                    transition: playing ? "height 1s, padding 1s, margin-bottom 1s" : "height 0.6s, padding 0.6s, margin-bottom 0.6s",
                                    "@media screen and (max-width:704px)": {
                                        width: theme.spacing(22),
                                        height: playing && solved ? theme.spacing(8) : "0px",
                                    }
                                }}
                            >
                                < Grid
                                    container
                                    flexDirection={"row"}
                                    flexWrap={"nowrap"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    alignContent={"center"}
                                    width={"100%"}
                                    height={"100%"}
                                    sx={{
                                        "@media screen and (max-width:704px)": {
                                            flexDirection: "column",
                                            gap: theme.spacing(1)
                                        }
                                    }}
                                >
                                    <Button
                                        variant={"outlined"}
                                        size={"large"}
                                        sx={{
                                            width: theme.spacing(20),
                                            color: "#ffffff",
                                            borderColor: "#ffffff",
                                            "@media screen and (max-width:704px)": {
                                                width: theme.spacing(12)
                                            },
                                            "&:hover": {
                                                color: "#40c0ff",
                                            }
                                        }}
                                        onClick={copy_result_to_clipboard}
                                        endIcon={<ShareIcon />}
                                    >
                                        Share
                                    </Button>
                                    <Button
                                        variant={"outlined"}
                                        size={"large"}
                                        sx={{
                                            width: theme.spacing(20),
                                            color: "#ffffff",
                                            borderColor: "#ffffff",
                                            "@media screen and (max-width:704px)": {
                                                width: theme.spacing(12)
                                            },
                                            "&:hover": {
                                                color: "#40c0ff",
                                            }
                                        }}
                                        onClick={return_to_top}
                                        endIcon={<HomeIcon />}
                                    >
                                        Top
                                    </Button>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Box>
                </ThemeProvider>
            </body>
        </>
    )
}

export default React.memo(ReflecMino);
// export default App;