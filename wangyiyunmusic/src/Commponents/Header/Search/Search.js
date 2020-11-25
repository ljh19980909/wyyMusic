import React, { Component } from 'react';
import './Search.css';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import Network from '../../Fetch/network';
import Store from '../../ReactRedux/Store/Store';
import { songs } from '../../ReactRedux/Actions/Actions';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hot: [],
            value: '',
            songs: [],
            normal: [],
            sings: [],
            // 存储数据
            a: Store.getState().songs,
        };
        console.log(props);
    }
    // 搜索
    search(e) {
        this.setState(
            {
                value: e.target.value,
            },
            () => {
                this.Req(this.state.value);
            }
        );
    }
    // 请求数据
    Req = a => {
        Network.get(`search/suggest?keywords=${a}`)
            // 专辑+图片
            .then(data => {
                console.log(data);
                this.setState({
                    songs: [...(data.result.artists ? data.result.artists : [])],
                    sings: [...(data.result.playlists ? data.result.playlists : [])],
                });
            })
            // 歌曲名+歌手
            .then(
                Network.get(`/search?keywords=${a}`)
                    .then(data => {
                        this.setState({
                            normal: [...data.result.songs],
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    })
            )
            .catch(error => {
                console.log(error);
            });
    };
    // 热门搜索
    hotSearch = v => {
        this.setState(
            {
                value: v,
            },
            () => {
                this.refs.inputs.value = v;
                this.Req(this.state.value);
            }
        );
    };
    // 清空搜索框
    clear() {
        this.setState(
            {
                value: '',
            },
            () => {
                this.refs.inputs.value = '';
            }
        );
    }
    // 点击播放
    play = (v, i) => {
        // 存数据
        Network.get(`song/detail?ids=${v.id}`)
            .then(data => {
                console.log(data);
                // Store.dispatch(
                //     songs({
                //         songs: this.state.a,
                //         information: {
                //             sn: data.songs[0].name,
                //             sm:
                //                 data.songs[0].ar.length > 1
                //                     ? data.songs[0].ar[0].name + '/' + data.songs[0].ar[1].name
                //                     : data.songs[0].ar[0].name,
                //             sp: data.songs[0].al.picUrl,
                //             sd: data.songs[0].id,
                //             sType: 'SingersList',
                //             item: i,
                //         },
                //     })
                // );
            })
            .catch(error => {
                console.log(error);
            });
    };
    // 回退上一页
    backClick() {
        this.props.history.go(-1);
    }
    render() {
        return (
            <div className="sc-kkGfuU bSldhq fly-enter-done">
                {/* 搜索 */}
                <div className="search_box_wrapper">
                    <div className="sc-jDwBTQ iqjFYw">
                        <i className="iconfont icon-back" onClick={() => this.backClick()}>
                            <ArrowLeftOutlined />
                        </i>
                        <input
                            className="box"
                            placeholder="搜索歌曲、歌手、专辑"
                            onChange={e => this.search(e)}
                            ref="inputs"
                        />
                        {/* 清空搜索 */}
                        <i
                            className="iconfont icon-delete"
                            style={{ display: this.state.value === '' ? 'none' : 'block' }}
                            onClick={() => {
                                this.clear();
                            }}
                        >
                            <CloseOutlined />
                        </i>
                    </div>
                </div>
                {/* 热门搜索 */}
                <div
                    className="sc-iAyFgw fQYMaH"
                    style={{ display: this.state.value === '' ? 'block' : 'none' }}
                >
                    <div className="sc-EHOje jiwVax">
                        <div>
                            <div className="sc-hSdWYo izlupb">
                                <h1 className="title">热门搜索</h1>
                                <ul>
                                    {this.state.hot.map((v, i) => {
                                        return (
                                            <li
                                                className="item"
                                                key={i}
                                                onClick={() => this.hotSearch(v.first)}
                                            >
                                                <span>{v.first}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                {/* 正常搜索 */}
                <div
                    className="sc-iAyFgw fjhtrQ"
                    style={{ display: this.state.value === '' ? 'none' : 'block' }}
                >
                    <div className="sc-EHOje jiwVax">
                        <div>
                            {/* 相关歌手 */}
                            <div
                                className="sc-brqgnP eDZwDT"
                                style={{
                                    display: this.state.songs.length === 0 ? 'none' : 'block',
                                }}
                            >
                                <h1 className="title">相关歌手</h1>
                                {this.state.songs.map((v, i) => {
                                    return (
                                        <div className="sc-cMljjf hZTOKT" key={i}>
                                            <div className="img_wrapper">
                                                <img
                                                    width="100%"
                                                    height="100%"
                                                    src={v.picUrl}
                                                    alt="music"
                                                />
                                            </div>
                                            <span className="name">歌手：{v.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* 相关歌单 */}
                            <div
                                className="sc-brqgnP eDZwDT"
                                style={{
                                    display: this.state.sings.length === 0 ? 'none' : 'block',
                                }}
                            >
                                <h1 className="title">相关歌单</h1>
                                {this.state.sings.map((v, i) => {
                                    return (
                                        <div className="sc-cMljjf hZTOKT" key={i}>
                                            <div className="img_wrapper">
                                                <img
                                                    width="100%"
                                                    height="100%"
                                                    src={v.coverImgUrl}
                                                    alt="music"
                                                />
                                            </div>
                                            <span className="name">歌单：{v.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {/* 搜索歌曲 */}
                            <ul className="sc-csuQGl kmUNA" style={{ paddingLeft: '20px' }}>
                                {this.state.normal.map((v, i) => {
                                    return (
                                        <li key={i} onClick={() => this.play(v, i)}>
                                            <div className="info">
                                                <span>{v.name}</span>
                                                <span>
                                                    {v.artists[0].name} - {v.album.name}
                                                </span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        Network.get('/search/hot')
            .then(data => {
                console.log(data);
                this.setState({
                    hot: [...data.result.hots],
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
}
