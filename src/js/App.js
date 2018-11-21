import React, { Component } from 'react';
import '../css/App.css';
import List from './List';
import $ from "jquery";

const API_KEY = 'AIzaSyD-G5LIZY-6xKQNBVRX5yuITVkIYrumBeU';

class App extends Component {
    state = {
        keyword: null,          // 검색 쿼리
        nextPageToken: null,    // 다음 페이지의 토큰
        videos: [],             // 동영상들 (검색 결과)
        scrollEnd: false,       // 무한 스크롤 감지
    }

    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.backToTop = this.backToTop.bind(this);

        // 스크롤 끝 감지해서 무한 스크롤
        window.onscroll = () => {
            // 스크롤 끝 감지
            if($(window).scrollTop() + $(window).innerHeight() - document.body.scrollHeight >= -5.0) {
                this.setState({
                    scrollEnd: true
                }, () => {
                    this.fetchData();
                });
            }
        }
    }

    // 검색 동작
    search(e) {
        e.preventDefault();
        this.setState({
            keyword: this.query.value,
            videos: []
        }, () => {
            this.fetchData();
        });
    }

    // Top 아이콘을 눌렀을 때 맨 위로 이동
    backToTop(e) {
         window.scrollTo(0, 0);
    }

    // API로부터 데이터 가져옴
    fetchData() {
        var that = this;
        // API와 query 반영. 기본 반영 개수는 5개인데 5개가 적절하다고 판단하여 건드리지 않음
        // 무한 스크롤 중일 경우 다음 페이지의 내용도 가져옴
        var url = "https://www.googleapis.com/youtube/v3/search?key=" + API_KEY +
                "&part=snippet,id&q=" + that.state.keyword;
        url += (that.state.scrollEnd && that.state.nextPageToken !== null) ? ("&pageToken=" + that.state.nextPageToken) : "";
        fetch(url)
        .then(function(response) {
            if(response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(data) {
            // 중복 Load 피하기 위함
            var currVideos = (that.state.nextPageToken !== data.nextPageToken) ? that.state.videos.concat(data.items) : that.state.videos;
            that.setState({
                nextPageToken: data.nextPageToken,
                videos: currVideos,
                scrollEnd: false
            });
        })
        .catch(error => {
            console.error(error);
        });
    }

    render() {
        const { videos } = this.state;

        return (
            <html lang="ko">
            <head>
                <title>Search YouTube Videos Service</title>
            </head>
            <body>
                <div id="container">
                <header>
                    <h1>Search <span>Videos</span></h1>
                    <p>Search all YouTube Videos</p>
                </header>
                <section>
                    <form id="search-form" method="get" onSubmit={ this.search }>
                        <div className="fieldcontainer">
                            <input type="text" id="query" name="query" className="search-field" placeholder="Search YouTube" ref={ (query) => this.query = query }/>
                            <input type="submit" name="search-btn" className="search-btn" value="      "/>
                        </div>
                    </form>
                    <ul id='results' className='item-list'>
                        <List videos={ videos }/>
                    </ul>
                </section>
                </div>
                <div id="back-to-top" onClick={ this.backToTop }></div>
            </body>
            </html>
        );
    }
}

export default App;
