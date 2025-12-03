// src/data/museumData.js
// public으로 관리할 게 아니면 import해서 사용
import louvreInside from '../assets/images/museumdatas/louvre_in.jpg';
import orsayInside from '../assets/images/museumdatas/orsay_in.jpg';
import pompidouInside from '../assets/images/museumdatas/pompidou_in.jpg';
import orangerieInside from '../assets/images/museumdatas/orangerie_in.jpg';
import diamondAceCheater from '../assets/images/museumdatas/louvre/diamond_ace_cheater.png';
import astronomer from '../assets/images/museumdatas/louvre/astronomer.png';
import raftOfTheMedusa from '../assets/images/museumdatas/louvre/raft_of_the_medusa.png';
import coronationOfNapoleon from '../assets/images/museumdatas/louvre/coronation_of_napoleon.png';
import starryNightOverTheRhone from '../assets/images/museumdatas/orsay/starry_night_over_the_rhone.png';
import saintTropezHarbor from '../assets/images/museumdatas/orsay/saint_tropez_harbor.png';
import moulinDeLaGalette from '../assets/images/museumdatas/orsay/moulin_de_la_galette.png';
import saintLazareStation from '../assets/images/museumdatas/orsay/saint_lazare_station.png';
import blueii from '../assets/images/museumdatas/pompidou/blue_ii.png';
import bluemonochromeikb3 from '../assets/images/museumdatas/pompidou/blue_monochrome_ikb_3.png';
import yellowredblue from '../assets/images/museumdatas/pompidou/yellow_red_blue.png';
import eiffeltower from '../assets/images/museumdatas/pompidou/eiffel_tower.png';
import orangerieWaterLiliesClouds from '../assets/images/museumdatas/orangerie/water_lilies_clouds.png';
import wedding from '../assets/images/museumdatas/orangerie/wedding.png';
import portraitOfChanel from '../assets/images/museumdatas/orangerie/portrait_of_chanel.png';
import stormySea from '../assets/images/museumdatas/orangerie/stormy_sea.png';

export const museumData = {
  louvre: {
    id: 'louvre',
    name: 'Musée du Louvre',
    // 1단계: 미술관 내부 설명 데이터 (이미지 + 텍스트)
    intro: {
      image: louvreInside, // 내부 전경 이미지
      title: '과거의 영광, 루브르',
      desc: '이곳은 원래 요새였습니다. 왕들의 거주지였던 이곳은...',
    },
    // 2단계: 전시된 작품들 데이터 리스트
    artworks: [
      {
        id: 1,
        title: '다이아몬드 \n에이스 사기꾼',
        artist: '조르주 드 라 투르',
        image: diamondAceCheater,
        desc: '17세기 프랑스 화가 조르주 드 라 투르의 걸작입니다. 인물들의 눈빛 교환과 사기꾼이 뒤로 숨긴 카드가 긴장감을 줍니다.',
      },
      {
        id: 2,
        title: '천문학자',
        artist: '조르주 드 라 투르',
        image: astronomer,
        desc: '"진주 귀걸이를 한 소녀"로 유명한 베르메르의 작품입니다. 한 학자가 창가에서 천구의(별자리 지구본)를 손으로 돌리며 깊은 연구에 빠져 있습니다. 빛의 마술사답게 창으로 들어오는 햇살 표현이 섬세합니다',
      },
      {
        id: 3,
        title: '메두사 호의 뗏목',
        artist: '테오도르 제리코',
        image: raftOfTheMedusa,
        desc: '실제 있었던 난파 사건을 다룬 낭만주의의 대표작입니다. 구조선을 향해 필사적으로 손을 흔드는 생존자들과 이미 죽은 이들이 뒤엉켜 있습니다. 거친 파도와 어두운 구름이 절망적인 분위기를 자아냅니다. \n\n 어둡고 푸른 톤, 그리고 거친 파도가 있어 "파랑"과 "물"의 조건을 충족하는 듯합니다',
      },
      {
        id: 4,
        title: '키테라 섬의 순례',
        artist: '앙투안 와토',
        image: coronationOfNapoleon,
        desc: '로코코 미술의 우아함을 보여주는 작품입니다. 사랑의 여신 비너스의 섬, 키테라로 떠나는(혹은 돌아오는) 수많은 연인들이 그려져 있습니다. 몽환적인 풍경과 부드러운 색감이 특징입니다. \n\n 수많은 남녀가 등장하여 "뒷모습의 연인" 단서를 떠올리게 합니다.',
      },
    ],
  },

  orsay: {
    id: 'orsay',
    name: 'Musée d’Orsay',
    intro: {
      image: orsayInside,
      title: '기차역에서 미술관으로',
      desc: '오르세는 원래 기차역이었습니다. 산업혁명의 상징이...',
    },
    artworks: [
      {
        id: 1,
        title: '아를의 \n별이 빛나는 밤',
        artist: '빈센트 반 고흐',
        image: starryNightOverTheRhone,
        desc: '1888년 아를의 론 강가를 그린 고흐의 걸작입니다. 밤하늘에는 별들이 크게 빛나고, 강 건너편 도시의 가스등 불빛이 물 위에 길게 황금색 그림자를 드리우고 있습니다. 전경에는 한 쌍의 노부부가 팔짱을 끼고 산책 중입니다. \n\n 소용돌이 없이 고요한 밤입니다.',
      },
      {
        id: 2,
        title: '생트로페 항구',
        artist: '폴 시냐크',
        image: saintTropezHarbor,
        desc: '작은 점을 무수히 찍어 색을 표현하는 "점묘법"으로 그려진 항구 풍경입니다. 노을 지는 항구의 붉은 빛과 바다의 푸른 빛이 시각적으로 섞이며 강렬한 빛의 효과를 냅니다. \n\n 물 위에 빛이 반사되는 모습은 “물 위의 불"과 흡사합니다.',
      },
      {
        id: 3,
        title: '물랭 드 라 갈레트의 무도회',
        artist: '오귀스트 르누아르',
        image: moulinDeLaGalette,
        desc: '몽마르트 언덕의 야외 무도회장을 가득 채운 인파를 그렸습니다. 나뭇잎 사이로 쏟아지는 햇살이 사람들의 옷 위에서 얼룩덜룩하게 춤을 춥니다. 행복과 즐거움이 가득한 그림입니다.\n\n 인공적인 조명과 수많은 사람들이 있어 화려합니다.',
      },
      {
        id: 4,
        title: '생 라자르 역',
        artist: '클로드 모네',
        image: saintLazareStation,
        desc: '기차역 내부로 들어오는 기차와 뿜어져 나오는 증기를 포착했습니다. 모네는 기차의 연기가 빛을 받아 변하는 순간을 그리기 위해 역장에게 기차를 멈춰달라고 부탁하기도 했습니다. \n\n 화면을 가득 채운 푸른 증기와 거친 붓터치는 마치 기계의 "거친 숨결"처럼 보입니다.',
      },
    ],
  },

  pompidou: {
    id: 'pompidou',
    name: 'Centre Pompidou',
    intro: {
      image: pompidouInside,
      title: '현대미술의 성지',
      desc: '폼피두 센터는 혁신적인 건축물로, 현대미술의 중심지입니다...',
    },
    artworks: [
      {
        id: 1,
        title: '블루 II',
        artist: '호안 미로',
        image: blueii,
        desc: '거대한 파란색 캔버스 위에 붉은 점과 검은 선들이 부유하듯 그려져 있습니다. 미로의 꿈속 세계를 표현한 것으로, 어린아이의 그림처럼 순수하고 자유롭습니다. \n\n 파란 배경 위에 떠 있는 붉은 점들이 마치 “별"처럼 보일 수 있습니다.',
      },
      {
        id: 2,
        title: 'Blue Monochrome (IKB 3)',
        artist: '이브 클라인',
        image: bluemonochromeikb3,
        desc: '캔버스 전체가 작가가 특허를 낸 고유의 색, "인터내셔널 클라인 블루(IKB)"로만 칠해져 있습니다. 붓자국조차 남기지 않은 이 그림은 무한한 우주와 명상을 상징합니다. \n\n 깊고 강렬한 파란색이 마치 우주를 연상시키며, “별"과 같은 신비로운 느낌을 줍니다.',
      },
      {
        id: 3,
        title: '노랑, 빨강, 파랑',
        artist: '바실리 칸딘스키',
        image: yellowredblue,
        desc: '추상미술의 아버지 칸딘스키의 대표작입니다. 왼쪽의 기하학적인 직선과 오른쪽의 자유로운 곡선이 대비를 이루며, 마치 캔버스 위에서 음악이 연주되는 듯한 리듬감을 줍니다. \n\n복잡한 형태들이 얽혀 있어, 얼핏 보면 "소용돌이" 치는 것처럼 보입니다',
      },
      {
        id: 4,
        title: '에펠탑',
        artist: '로베르 들로네',
        image: eiffeltower,
        desc: '파리의 상징인 에펠탑을 입체파적으로 해체하여 재구성했습니다. 붉은색과 푸른색의 강렬한 대비를 통해 에펠탑이 하늘 높이 솟아오르는 역동성을 표현했습니다. \n\n건물이 춤추듯 움직이는 역동적인 그림입니다.',
      },
    ],
  },

  orangerie: {
    id: 'orangerie',
    name: "Musée de l'Orangerie",
    intro: {
      image: orangerieInside,
      title: '자연과 예술의 만남',
      desc: '오랑주리는 자연광이 아름답게 들어오는 공간으로, 모네의 수련 연작이 전시되어 있습니다...',
    },
    artworks: [
      {
        id: 1,
        title: '수련 : 구름',
        artist: '클로드 모네',
        image: orangerieWaterLiliesClouds,
        desc: '모네가 지베르니 정원의 연못을 거대한 파노라마로 담아냈습니다. 땅과 하늘의 경계 없이, 물 위에 비친 구름과 수련만이 끝없이 펼쳐집니다. 보는 이를 물속으로 끌어당기는 듯합니다. \n\n 이곳은 오직 자연의 빛만 존재합니다.',
      },
      {
        id: 2,
        title: '결혼식',
        artist: '앙리 루소',
        image: wedding,
        desc: '시골의 결혼식 풍경을 그렸지만, 신랑 신부와 하객들의 표정이 기묘하게 굳어 있습니다. 원근법이 무시된 평면적인 배경과 검은 개 한 마리가 묘한 불안감을 줍니다.',
      },
      {
        id: 3,
        title: '샤넬의 초상',
        artist: '마리 로랑생',
        image: portraitOfChanel,
        desc: '패션 디자이너 코코 샤넬을 그렸지만, 정작 샤넬은 "나와 닮지 않았다"며 인수를 거절한 그림입니다. 로랑생 특유의 파스텔 톤과 흐릿한 윤곽선이 몽환적이고 우울한 분위기를 냅니다. \n\n 꿈속 같은 흐릿한 분위기가 의뢰인 L의 희미한 기억과 닮았습니다.',
      },
      {
        id: 4,
        title: '폭풍우 속의 배',
        artist: '앙리 루소',
        image: stormySea,
        desc: '거친 파도가 치는 바다 위에 작은 배 한 척이 떠 있습니다. 제목은 폭풍우지만, 루소 특유의 꼼꼼하고 평면적인 묘사 때문에 마치 장난감 배가 멈춰 있는 듯한 초현실적인 느낌을 줍니다. \n\n 폭풍우 그림인데도 "소용돌이가 멈춘" 듯 정적입니다.',
      },
    ],
  },
};

export default museumData;
