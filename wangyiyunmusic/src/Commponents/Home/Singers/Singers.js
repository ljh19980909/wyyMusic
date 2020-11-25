import React, { Component } from 'react';
import { Object } from '../Death/Death';
import './Singers.css';
import Network from '../../Fetch/network';
import { add } from '../../ReactRedux/Actions/Actions';
import Store from '../../ReactRedux/Store/Store';

export default class Singers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Classifties: Object,
            artists: [],
            selected1: '',
            selected2: '',
        };
        this.scrollevent = this.scrollevent.bind(this);
    }
    songfests(id) {
        console.log(id);
        this.props.history.push({ pathname: '/singersList', state: { id } });
        Store.dispatch(add(id));
    }
    render() {
        return (
            <div className="signers">
                {/* 分类 */}
                <div className="sc-iAyFgw dUBiHX">
                    <div className="sc-EHOje jiwVax">
                        <div>
                            <div className="sc-kEYyzF fGbcNn">
                                <span>分类(默认热门):</span>
                                {this.state.Classifties.classifity.map((v, i) => {
                                    return (
                                        <span
                                            className={
                                                this.state.selected1 === v
                                                    ? 'sc-kkGfuU cEMLqX selected'
                                                    : 'sc-kkGfuU cEMLqX'
                                            }
                                            key={i}
                                            onClick={() => this.chooseClassifity(v)}
                                        >
                                            {v}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {/* 字母 */}
                    <div className="sc-EHOje jiwVax" style={{ marginTop: '-15px' }}>
                        <div>
                            <div className="sc-kEYyzF fGbcNn">
                                <span>首字母:</span>
                                {this.state.Classifties.English.map((v, i) => {
                                    return (
                                        <span
                                            className={
                                                this.state.selected2 === v
                                                    ? 'sc-kkGfuU cEMLqX selected'
                                                    : 'sc-kkGfuU cEMLqX'
                                            }
                                            key={i}
                                            onClick={() => this.chooseEnglish(v, i)}
                                        >
                                            {v}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
                {/* 展示 */}
                <div className="sc-hSdWYo eLXbUt">
                    <div className="sc-EHOje jiwVax" id="ul1">
                        <div className="sc-eHgmQL fYeUcK">
                            {this.state.artists.map((v, i) => {
                                return (
                                    <div
                                        className="sc-cvbbAY kOhXxf"
                                        key={i}
                                        onClick={() => this.songfests(v.id)}
                                    >
                                        <div className="img_wrapper">
                                            <img
                                                width="100%"
                                                height="100%"
                                                src={v.img1v1Url}
                                                alt="music"
                                            />
                                        </div>
                                        <span className="name">{v.name}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount() {
        document.getElementById('ul1').addEventListener('scroll', this.scrollevent);
        Network.get('/top/artists?offset=0')
            .then(data => {
                this.setState({
                    artists: [...data.artists],
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
    // 点击分类
    chooseClassifity(i) {
        this.setState({ selected1: i });
    }
    // 点击字母
    chooseEnglish(i) {
        this.setState({ selected2: i, artists: [] }, () => {
            Network.get(`/artist/list?cat=1003&initial=${i}&offset=0`)
                .then(data => {
                    this.setState({
                        artists: [...data.artists, this.state.artists],
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        });
    }
    // 监控滚轮高度
    scrollevent(event) {
        console.log(
            'clientHeight:',
            Math.ceil(event.target.scrollTop),
            event.target.clientHeight,
            event.target.scrollHeight
        );
        let isToBottom =
            Math.ceil(event.target.scrollTop) +
                event.target.clientHeight -
                event.target.scrollHeight ===
            0;
        let offset = 0;
        if (isToBottom) {
            offset++;
            this.choose(offset);
        }
    }
    // 达到高度之后再次请求
    choose(i) {
        Network.get(`/top/artists?offset=${i}`)
            .then(data => {
                this.setState({
                    artists: [...data.artists, ...this.state.artists],
                });
            })
            .catch(error => {
                console.log(error);
            });
    }
}
