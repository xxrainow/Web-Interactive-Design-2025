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
        desc: '"진주 귀걸이를 한 소녀"로 유명한 베르메르의 작품입니다. 한 학자가 창가에서 천구의(별자리 지구본)를 손으로 돌리며 깊은 연구에 빠져 있습니다. 빛의 마술사답게 창으로 들어오는 햇살 표현이 섬세합니다 \n \n별을 관측하는 사람이라는 점에서 "일곱 개의 감시자(북두칠성)"와 관련 있어 보입니다.',
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
        title: '별이 빛나는 밤',
        image: '/images/starry.jpg',
        desc: '고흐의 걸작...',
      },
      // ...
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
        title: '캔버스 위의 춤',
        image: '/images/dance.jpg',
        desc: '모던 아트의 정수...',
      },
      // ...
    ],
  },

  orangerie: {
    id: 'orangerie',
    name: orangerieInside,
    intro: {
      image: '/images/orangerie_in.jpg',
      title: '자연과 예술의 만남',
      desc: '오랑주리는 자연광이 아름답게 들어오는 공간으로, 모네의 수련 연작이 전시되어 있습니다...',
    },
    artworks: [
      {
        id: 1,
        title: '수련 연작',
        image: '/images/waterlilies.jpg',
        desc: '모네의 대표작...',
      },
      // ...
    ],
  },
};

export default museumData;
