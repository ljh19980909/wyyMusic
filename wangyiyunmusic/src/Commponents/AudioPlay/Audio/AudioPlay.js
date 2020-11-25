import React, { Component, useRef } from 'react';
import {
    PlayCircleOutlined,
    UnorderedListOutlined,
    PauseCircleOutlined,
    DownOutlined,
    StepBackwardFilled,
    StepForwardOutlined,
    DeleteOutlined,
    HeartOutlined,
    TrademarkCircleOutlined,
} from '@ant-design/icons';
import './AudioPage.css';
import Store from '../../ReactRedux/Store/Store';
import { songs } from '../../ReactRedux/Actions/Actions';
import Network from '../../Fetch/network';
import { CSSTransition } from 'react-transition-group';

class Audio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 播放器
            rateList: [0.75, 1.0, 1.25, 1.5, 2.0],
            playRate: 1.0,
            isPlay: false,
            isMuted: false,
            volume: 100,
            allTime: 0,
            currentTime: 0,
            isShow: false,
            isShow2: false,
            src: '',
            // 底部旋转
            dushu: 0,
            shows: false,
            index: 1,
            // 数据存储
            songs: Store.getState().songs,
            information: Store.getState().songs.information,
            hotSongs: [],
            RandomSongs: [],
            currentSongs: {},
            randomSongs: [],
            Random: Store.getState().Random,
            a: Store.getState().playmenu_id,
            // 歌词
            Lyrics: [],
            lyricists: true,
        };
        this.changeShow = this.changeShow.bind(this);
    }
    // 详细页展示隐藏
    changeShow() {
        this.setState(
            {
                isShow: !this.state.isShow,
                isShow2: !this.state.isShow2,
            },
            () => {
                console.log(this.state.isShow);
            }
        );
    }
    // 歌曲时间
    formatSecond(time) {
        const second = Math.floor(time % 60);
        let mins = Math.floor(time / 60);
        return `${mins}:${second >= 10 ? second : `0${second}`}`;
    }
    // 该音频已准备好开始播放
    onCanPlay = () => {
        const { id } = this.props;
        const audio = document.getElementById(`audio${id}`);
        this.setState({
            allTime: audio.duration,
        });
    };
    // 播放
    playAudio = () => {
        console.log('111111111111111111');
        const { id } = this.props;
        const audio = document.getElementById(`audio${id}`);
        this.setState(
            {
                src: this.state.src,
                isPlay: true,
            },
            () => {
                this.musicUrl(this.state.currentSongs.sd, () => {
                    audio.play();
                    this.setState({
                        isPlay: true,
                    });
                });
            }
        );
    };
    // 暂停
    pauseAudio = () => {
        const { id } = this.props;
        const audio = document.getElementById(`audio${id}`);
        audio.pause();
        this.setState({
            isPlay: false,
        });
    };
    // 改变时间
    changeTime = e => {
        const { value } = e.target;
        const { id } = this.props;
        const audio = document.getElementById(`audio${id}`);
        this.setState({
            currentTime: value,
        });
        audio.currentTime = value;
        if (value === audio.duration) {
            this.setState({
                isPlay: false,
            });
        }
    };
    // audio时间改变事件
    onTimeUpdate = () => {
        const { id } = this.props;
        const audio = document.getElementById(`audio${id}`);

        this.setState(
            {
                currentTime: audio.currentTime,
            },
            () => {
                this.lyricsScroll(this.state.currentTime);
            }
        );
        if (audio.currentTime === audio.duration) {
            this.setState(
                {
                    isPlay: false,
                },
                () => {
                    this.musicLoop();
                }
            );
        }
    };
    // 倍速播放
    changePlayRate = num => {
        this.audioDom.playbackRate = num;
        this.setState({
            playRate: num,
        });
    };
    // 音乐列表遮罩层出现隐藏
    Isshow() {
        this.setState({ shows: !this.state.shows });
    }
    // 改变图标播放
    changeIcon(e) {
        e.stopPropagation();
        this.setState(
            {
                index: (this.state.index += 1),
            },
            () => {
                if (this.state.index % 3 === 0) {
                    this.state.randomSongs = [...this.shuffle(this.state.hotSongs)];
                }
            }
        );
    }
    // 播放歌曲数据
    componentWillMount() {
        console.log('我走了这个!!!');
        this.setState({
            currentSongs: { ...this.state.information },
        });
        Network.get(
            this.state.information.sType === 'SongList'
                ? `/playlist/detail?id=${this.state.songs.songs}`
                : `/artists?id=${this.state.songs.songs}`
        )
            .then(data => {
                console.log(this.state.hotSongs);
                this.setState({
                    hotSongs: [
                        ...(this.state.information.sType === 'SongList'
                            ? data.playlist.tracks
                            : data.hotSongs),
                    ],
                    RandomSongs: [
                        ...(this.state.information.sType === 'SongList'
                            ? data.playlist.tracks
                            : data.hotSongs),
                    ],
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    // 存数据
    save = (b, a) => {
        // 存数据
        Store.dispatch(
            songs({
                songs: this.state.songs.songs,
                information: {
                    sn: b.name,
                    sm: b.ar.length > 1 ? b.ar[0].name + '/' + b.ar[1].name : b.ar[0].name,
                    sp: b.al.picUrl,
                    sd: b.id,
                    sType: 'SongList',
                    item: a,
                },
            })
        );
    };
    // 上一首
    prev() {
        let ListHeight = this.refs.listHeight ? this.refs.listHeight : '';
        ListHeight.scrollTop = 0;

        const { id } = this.props;
        const audio = document.getElementById(`audio${id}`);
        audio.pause();
        this.setState(
            {
                isPlay: false,
            },
            () => {
                // 判断是否是随机
                if (this.state.index % 3 === 0) {
                    console.log('---------');
                    this.state.randomSongs.forEach((v, i) => {
                        if (v.id === this.state.information.sd) {
                            if (this.state.information.item - 1 >= 0) {
                                let b = this.state.randomSongs[i - 1],
                                    a = i - 1;
                                this.save(b, a);
                            } else {
                                return;
                            }
                        }
                    });
                    this.playAudio();
                } else {
                    if (this.state.information.item - 1 >= 0) {
                        let b = this.state.RandomSongs[this.state.information.item - 1],
                            a = this.state.information.item - 1;
                        this.save(b, a);
                    } else {
                        return;
                    }
                }
            }
        );
    }
    // 下一首
    next() {
        let ListHeight = this.refs.listHeight ? this.refs.listHeight : '';
        ListHeight.scrollTop = 0;
        const { id } = this.props;
        const audio = document.getElementById(`audio${id}`);
        audio.pause();
        this.setState(
            {
                isPlay: false,
            },
            () => {
                // 判断是否是随机
                if (this.state.index % 3 === 0) {
                    this.state.randomSongs.forEach((v, i) => {
                        if (v.id === this.state.information.sd) {
                            if (this.state.information.item + 1 < this.state.randomSongs.length) {
                                let b = this.state.randomSongs[i + 1],
                                    a = i + 1;
                                this.save(b, a);
                            } else {
                                return;
                            }
                        }
                    });
                    this.playAudio();
                } else {
                    console.log(this.state.RandomSongs);
                    this.state.RandomSongs.forEach((v, i) => {
                        if (v.id === this.state.information.sd) {
                            console.log(this.state.information.item);
                            if (this.state.information.item + 1 < this.state.RandomSongs.length) {
                                let b = this.state.RandomSongs[i + 1],
                                    a = i + 1;
                                this.save(b, a);
                            } else {
                                return;
                            }
                        }
                    });
                }
            }
        );
    }
    // 音乐url/歌词
    musicUrl = (a, fn) => {
        Network.get(`/song/url?id=${a}`)
            .then(data => {
                this.setState(
                    {
                        src: data.data[0].url,
                    },
                    () => {
                        fn();
                    }
                );
            })
            .then(
                Network.get(`lyric?id=${a}`)
                    .then(data => {
                        // 歌词处理
                        var str = data.lrc.lyric;
                        const lineStrings = str.split('\n');
                        const lyricList = [];
                        const parseExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
                        for (let line of lineStrings) {
                            if (line) {
                                const lrcContent = line.replace(parseExp, '').trim();
                                const timeResult = parseExp.exec(line);
                                const milliseconds =
                                    timeResult[3].length === 3
                                        ? timeResult[3] * 1
                                        : timeResult[3] * 10;
                                const lrcTime =
                                    timeResult[1] * 60 * 1000 + timeResult[2] * 1000 + milliseconds;
                                lyricList.push({
                                    lyc: lrcContent,
                                    time: lrcTime,
                                });
                            }
                        }
                        this.setState({
                            Lyrics: [...lyricList],
                        });
                    })
                    .catch(error => console.log(error))
            )
            .catch(error => console.log(error));
    };
    // 打乱顺序
    shuffle = arr => {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var index = parseInt(Math.random() * (len - i));
            var temp = arr[index];
            arr[index] = arr[len - i - 1];
            arr[len - i - 1] = temp;
        }
        return arr;
    };
    // 循环播放
    musicLoop = () => {
        let ListHeight = this.refs.listHeight ? this.refs.listHeight : '';
        ListHeight.scrollTop = 0;
        // 顺序播放
        if (this.state.index % 3 === 1) {
            console.log('顺序播放！！！！');
            this.setState(() => {
                if (this.state.currentTime === this.state.allTime) {
                    console.log('+++++++++++');
                    this.state.RandomSongs.forEach((v, i) => {
                        if (v.id === this.state.information.sd) {
                            console.log(ListHeight.scrollTop);
                            console.log(i);
                            if (this.state.information.item + 1 < this.state.RandomSongs.length) {
                                let b = this.state.RandomSongs[i + 1],
                                    a = i + 1;
                                this.save(b, a);
                            } else {
                                return;
                            }
                        }
                    });
                }
            });
            // 单曲循环
        } else if (this.state.index % 3 === 2) {
            console.log('单曲循环！！！！');
            this.setState(() => {
                let b = this.state.RandomSongs[this.state.information.item],
                    a = this.state.information.item;
                this.save(b, a);
            });
            // 随机播放
        } else if (this.state.index % 3 === 0) {
            console.log('随机播放！！！！');
            this.next();
        }
    };
    // 歌词
    lyrics = () => {
        this.setState(
            {
                lyricists: !this.state.lyricists,
            },
            () => {
                console.log(this.state.lyricists);
            }
        );
    };
    //歌词滚动
    lyricsScroll = currentTime => {
        let lrcTime = [];
        if (this.state.Lyrics) {
            this.state.Lyrics.forEach((v, i) => {
                lrcTime.push(v.time);
            });
            let ListHeight = this.refs.listHeight ? this.refs.listHeight : '';
            let arr = this.refs.ps ? [...this.refs.ps.children] : [];
            let a = arr.filter((v, i) => v.innerHTML !== '');
            a.forEach((v, i) => {
                if (v.style.color === 'red') {
                    if (v.offsetTop >= ListHeight.offsetHeight / 2) {
                        ListHeight.scrollTop = i * v.offsetHeight - ListHeight.offsetHeight / 2;
                    }
                }
            });
        }
    };
    // 歌词变化
    change = (v, Lyrics, currentTime) => {
        return (
            v.time ==
            (Lyrics.filter(v => v.time <= Math.floor(currentTime * 1000))[
                Lyrics.filter(v => v.time <= Math.floor(currentTime * 1000)).length - 1
            ]
                ? Lyrics.filter(v => v.time <= Math.floor(currentTime * 1000) + 500)[
                      Lyrics.filter(v => v.time <= Math.floor(currentTime * 1000) + 500).length - 1
                  ].lyc == ''
                    ? Lyrics.filter(v => v.time <= Math.floor(currentTime * 1000) + 500)[
                          Lyrics.filter(v => v.time <= Math.floor(currentTime * 1000) + 500)
                              .length - 2
                      ].time
                    : Lyrics.filter(v => v.time <= Math.floor(currentTime * 1000) + 500)[
                          Lyrics.filter(v => v.time <= Math.floor(currentTime * 1000) + 500)
                              .length - 1
                      ].time
                : '')
        );
    };
    //点击播放
    play(v, i, e) {
        e.stopPropagation();
        // 存数据
        Store.dispatch(
            songs({
                songs: this.state.a,
                information: {
                    sn: v.name,
                    sm: v.ar.length > 1 ? v.ar[0].name + '/' + v.ar[1].name : v.ar[0].name,
                    sp: v.al.picUrl,
                    sd: v.id,
                    sType: 'SongList',
                    item: i,
                },
            })
        );
    }
    // 点击删除
    del(Id, item, e) {
        e.stopPropagation();
        if (this.state.index % 3 !== 0) {
            console.log(item);
            this.state.RandomSongs.forEach((v, i) => {
                if (v.id === Id) {
                    this.state.RandomSongs.splice(v, 1);
                    this.setState({
                        RandomSongs: this.state.RandomSongs,
                    });
                }
            });
            console.log(this.state.RandomSongs);
        } else {
            console.log(item);
        }
    }
    // 设置监听器
    componentDidMount() {
        console.log('我走了一次!!!');
        this.listener1 = Store.subscribe(() => {
            this.setState(
                {
                    songs: Store.getState().songs,
                    information: Store.getState().songs.information,
                    Random: Store.getState().Random,
                },
                () => {
                    this.setState({
                        currentSongs: { ...this.state.songs.information },
                    });
                    Network.get(
                        this.state.information.sType === 'SongList'
                            ? `/playlist/detail?id=${this.state.songs.songs}`
                            : `/artists?id=${this.state.songs.songs}`
                    )
                        .then(data => {
                            this.setState({
                                // hotSongs: [
                                //     ...(this.state.information.sType === 'SongList'
                                //         ? data.playlist.tracks
                                //         : data.hotSongs),
                                // ],
                                RandomSongs: [
                                    ...(this.state.information.sType === 'SongList'
                                        ? data.playlist.tracks
                                        : data.hotSongs),
                                ],
                            });
                        })
                        .then(() => {
                            this.musicUrl(this.state.information.sd, () => {
                                this.playAudio();
                                this.setState({
                                    isShow: true,
                                });
                            });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            );
        });
    }
    // 销毁监听
    componentWillUnmount() {
        this.listener1();
    }
    //页面渲染
    render() {
        const { id } = this.props;
        const {
            isPlay,
            currentTime,
            rateList,
            playRate,
            src,
            allTime,
            Lyrics,
            lyricists,
        } = this.state;

        return (
            <div>
                <CSSTransition in={this.state.isShow2} timeout={800} classNames={'play2'}>
                    <div className="sc-cSHVUG fKsZno normal-enter-done">
                        {/* 背景图片 */}
                        <div className="background">
                            <img
                                src={this.state.currentSongs.sp}
                                width="100%"
                                height="100%"
                                alt="歌曲图片"
                            />
                        </div>
                        {/* 导航栏 */}
                        <div className="background layer"></div>
                        <div className="sc-kAzzGY ikbqYg top" onClick={this.changeShow}>
                            <div className="back">
                                <i className="iconfont icon-back">
                                    <DownOutlined />
                                </i>
                            </div>
                            {/* 展示歌曲作家 */}
                            <div className="text">
                                <h1 className="title">{this.state.currentSongs.sn}</h1>
                                <h1 className="subtitle">{this.state.currentSongs.sm}</h1>
                            </div>
                        </div>
                        {/* 中间图片 */}
                        <div className="sc-chPdSV cMLVFq" onClick={this.lyrics}>
                            {/* 圆圈图片 */}
                            <div
                                className="sc-kgoBCf hoWFac"
                                style={{ display: lyricists == true ? 'flex' : 'none' }}
                            >
                                <CSSTransition
                                    in={this.state.isPlay}
                                    timeout={800}
                                    classNames={'audioPointer'}
                                >
                                    <div className="needle pause"></div>
                                </CSSTransition>
                                <div className="cd">
                                    <CSSTransition
                                        in={this.state.isPlay}
                                        timeout={360000}
                                        classNames={'audioCD'}
                                    >
                                        <img
                                            className="image play pause"
                                            src={this.state.currentSongs.sp}
                                            alt=""
                                        />
                                    </CSSTransition>
                                </div>
                                {/* 当前唱的这一行歌词 */}
                                {Lyrics.map((v, i) => {
                                    return (
                                        <p
                                            className="playing_lyric"
                                            key={i}
                                            style={{
                                                display:
                                                    currentTime * 1000 >
                                                        (Lyrics[i] ? Lyrics[i].time : 0) &&
                                                    currentTime * 1000 <=
                                                        (Lyrics[i + 1] ? Lyrics[i + 1].time : 0)
                                                        ? 'block'
                                                        : 'none',
                                            }}
                                        >
                                            {v.lyc}
                                        </p>
                                    );
                                })}
                            </div>
                            {/* 歌词 */}
                            <div
                                className="sc-kGXeez FhfWp"
                                ref="listHeight"
                                style={{ display: lyricists === false ? 'flex' : 'none' }}
                            >
                                <div className="sc-EHOje jiwVax lyrisms">
                                    <div className="sc-kpOJdX cmqyBM lyric_wrapper" ref="ps">
                                        {Lyrics.map((v, i) => {
                                            return (
                                                <p
                                                    key={i}
                                                    style={{
                                                        color: this.change(v, Lyrics, currentTime)
                                                            ? 'red'
                                                            : 'rgba(255, 255, 255, 0.5)',
                                                        transform: this.change(
                                                            v,
                                                            Lyrics,
                                                            currentTime
                                                        )
                                                            ? 'scale(1)'
                                                            : 'scale(.8)',
                                                    }}
                                                    className={
                                                        this.change(v, Lyrics, currentTime)
                                                            ? ''
                                                            : 'ellipsis'
                                                    }
                                                >
                                                    {v.lyc}
                                                </p>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 歌曲系列 */}
                        <div className="sc-dxgOiQ lcnooX bottom">
                            {/* 倍速听歌 */}
                            <div className="sc-eNQAEJ ftMHzw">
                                <span>倍速听歌</span>
                                {rateList &&
                                    rateList.length > 0 &&
                                    rateList.map((item, i) => (
                                        <span
                                            key={i}
                                            className={
                                                playRate === item
                                                    ? 'sc-hMqMXs BLbDi selected'
                                                    : 'sc-hMqMXs BLbDi'
                                            }
                                            onClick={() => this.changePlayRate(item)}
                                        >
                                            x{item}
                                        </span>
                                    ))}
                            </div>
                            {/* 歌曲时间 */}
                            <div className="sc-ckVGcZ eNvyos">
                                <span className="time time-l">
                                    {this.formatSecond(currentTime)}
                                </span>
                                <div className="progress-bar-wrapper">
                                    <div className="sc-jzJRlG ZVqxa">
                                        {/* 进度条 */}
                                        <div className="bar-inner">
                                            <input
                                                className="progress"
                                                type="range"
                                                step="0.01"
                                                max={allTime}
                                                value={currentTime}
                                                onChange={this.changeTime}
                                                style={{
                                                    backgroundSize:
                                                        '' + (currentTime / allTime) * 100 + '%',
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="time time-r">{this.formatSecond(allTime)}</div>
                            </div>
                            {/* 最底部系列 */}
                            <div className="sc-jKJlTe ICZAx">
                                {/* 播放格式 */}
                                <div className="icon i-left" onClick={e => this.changeIcon(e)}>
                                    {/* 循环播放 */}
                                    <i
                                        className="iconfont"
                                        style={{
                                            display: this.state.index % 3 === 1 ? 'block' : 'none',
                                        }}
                                    >
                                        &#xe7b1;
                                    </i>
                                    {/* 单曲循环 */}
                                    <i
                                        className="iconfont"
                                        style={{
                                            display: this.state.index % 3 === 2 ? 'block' : 'none',
                                        }}
                                    >
                                        &#xe607;
                                    </i>
                                    {/* 随机播放 */}
                                    <i
                                        className="iconfont"
                                        style={{
                                            display: this.state.index % 3 === 0 ? 'block' : 'none',
                                        }}
                                    >
                                        &#xe71f;
                                    </i>
                                </div>
                                {/* 上一首 */}
                                <div className="icon i-left" onClick={() => this.prev()}>
                                    <StepBackwardFilled className="iconfont" />
                                </div>
                                {/* 播放暂停按钮 */}
                                <div className="icon i-center">
                                    <PlayCircleOutlined
                                        className="iconfont"
                                        style={{ display: isPlay ? 'none' : 'block' }}
                                        onClick={this.playAudio}
                                    />
                                    <PauseCircleOutlined
                                        className="iconfont"
                                        style={{ display: isPlay ? 'block' : 'none' }}
                                        onClick={this.pauseAudio}
                                    />
                                </div>
                                {/* 下一首 */}
                                <div className="icon i-right" onClick={() => this.next()}>
                                    <StepForwardOutlined className="iconfont" />
                                </div>
                                {/* 列表 */}
                                <div className="icon i-right" onClick={this.Isshow.bind(this)}>
                                    <UnorderedListOutlined className="iconfont" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CSSTransition>
                {/*  底部*/}
                <CSSTransition in={this.state.isShow} timeout={800} classNames={'play1'}>
                    <div
                        className="sc-fjdhpX jhulqO"
                        style={{ opacity: this.state.isShow ? 1 : 0 }}
                    >
                        {/* 左侧照片 */}
                        <div className="icon" onClick={this.changeShow}>
                            <div className="imgWrapper">
                                <CSSTransition
                                    in={this.state.isPlay}
                                    timeout={360000}
                                    classNames={'audioPlay'}
                                    // onEntered={()=>{console.log('进入动画完成');}}
                                    // onExited={()=>{console.log('离开动画完成');}}
                                >
                                    <img
                                        className="play "
                                        src={this.state.currentSongs.sp}
                                        width="40"
                                        height="40"
                                        alt="img"
                                    />
                                </CSSTransition>
                            </div>
                        </div>
                        {/* 中间歌名 */}
                        <div className="text">
                            <h2 className="name">{this.state.currentSongs.sn}</h2>
                            <p className="desc">{this.state.currentSongs.sm}</p>
                        </div>
                        {/* 暂停/播放 */}
                        <div className="control">
                            <div className="sc-jTzLTM eTtasj">
                                <PlayCircleOutlined
                                    className="icon-mini iconfont icon-pause boding"
                                    style={{ display: isPlay ? 'none' : 'block' }}
                                    onClick={this.playAudio}
                                />
                                <PauseCircleOutlined
                                    className="icon-mini iconfont icon-pause boding"
                                    style={{ display: isPlay ? 'block' : 'none' }}
                                    onClick={this.pauseAudio}
                                />
                            </div>
                        </div>
                        {/* 音乐列表 */}
                        <div className="control" onClick={this.Isshow.bind(this)}>
                            <UnorderedListOutlined className="iconfont" />
                        </div>
                    </div>
                </CSSTransition>
                {/* 音乐列表遮罩层出现隐藏 */}
                <CSSTransition in={this.state.shows} timeout={800} classNames={'play3'}>
                    <div
                        className="sc-htoDjs fBzsTO list-fade-enter-done"
                        onClick={this.Isshow.bind(this)}
                    >
                        <div className="list_wrapper">
                            {/* 播放格式 */}
                            <div className="sc-dnqmqq fMsXIX">
                                <h1 className="title">
                                    <div onClick={e => this.changeIcon(e)}>
                                        <i
                                            className="iconfont plays"
                                            style={{
                                                display:
                                                    this.state.index % 3 === 1 ? 'block' : 'none',
                                            }}
                                        >
                                            &#xe7b1;
                                        </i>
                                        <i
                                            className="iconfont plays"
                                            style={{
                                                display:
                                                    this.state.index % 3 === 2 ? 'block' : 'none',
                                            }}
                                        >
                                            &#xe607;
                                        </i>
                                        <i
                                            className="iconfont plays"
                                            style={{
                                                display:
                                                    this.state.index % 3 === 0 ? 'block' : 'none',
                                            }}
                                        >
                                            &#xe71f;
                                        </i>
                                        <span
                                            className="text"
                                            style={{
                                                display:
                                                    this.state.index % 3 === 1 ? 'block' : 'none',
                                            }}
                                        >
                                            顺序播放
                                        </span>
                                        <span
                                            className="text"
                                            style={{
                                                display:
                                                    this.state.index % 3 === 2 ? 'block' : 'none',
                                            }}
                                        >
                                            单曲循环
                                        </span>
                                        <span
                                            className="text"
                                            style={{
                                                display:
                                                    this.state.index % 3 === 0 ? 'block' : 'none',
                                            }}
                                        >
                                            随机播放
                                        </span>
                                    </div>
                                    <span className="iconfont clear">
                                        <DeleteOutlined />
                                    </span>
                                </h1>
                            </div>
                            {/* 音乐列表 */}
                            <div className="sc-iwsKbI ijAGZR">
                                <div className="sc-EHOje jiwVax">
                                    <div className="sc-gZMcBi iFUaXy">
                                        {(this.state.index % 3 === 0
                                            ? this.state.randomSongs
                                            : this.state.RandomSongs
                                        ).map((v, i) => {
                                            return (
                                                <li className="item" key={i}>
                                                    <i
                                                        className="current iconfont icon-play icon-plays"
                                                        style={{
                                                            opacity:
                                                                this.state.information.item == i
                                                                    ? '1'
                                                                    : '0',
                                                        }}
                                                    >
                                                        &#xe710;
                                                    </i>
                                                    <span
                                                        className="text "
                                                        onClick={e => this.play(v, i, e)}
                                                    >
                                                        {v.name} - {v.ar[0].name}
                                                    </span>
                                                    <span className="like">
                                                        <i className="iconfont icons">
                                                            <HeartOutlined />
                                                        </i>
                                                    </span>
                                                    <span
                                                        className="delete"
                                                        onClick={e => this.del(v.id, i, e)}
                                                    >
                                                        <i className="iconfont icons">
                                                            <DeleteOutlined />
                                                        </i>
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CSSTransition>
                {/* 播放器 */}
                <audio
                    id={`audio${id}`}
                    src={src}
                    ref={audio => {
                        this.audioDom = audio;
                    }}
                    preload={'auto'}
                    onCanPlay={this.onCanPlay}
                    onTimeUpdate={this.onTimeUpdate}
                >
                    <track src={src} kind="captions" />
                </audio>
            </div>
        );
    }
}
export default Audio;
