export class AnimalEntity {
  static numberTable = {
    1950: [32, 3, 31, 2, 32, 3, 33, 4, 35, 5, 36, 6],
    1951: [37, 8, 36, 7, 37, 8, 38, 9, 40, 10, 41, 11],
    1952: [42, 13, 42, 13, 43, 14, 44, 15, 46, 16, 47, 17],
    1953: [48, 19, 47, 18, 48, 19, 49, 20, 51, 21, 52, 22],
    1954: [53, 24, 52, 23, 53, 24, 54, 25, 56, 26, 57, 27],
    1955: [58, 29, 57, 28, 58, 29, 59, 30, 1, 31, 2, 32],
    1956: [3, 34, 3, 34, 4, 35, 5, 36, 7, 37, 8, 38],
    1957: [9, 40, 8, 39, 9, 40, 10, 41, 12, 42, 13, 43],
    1958: [14, 45, 13, 44, 14, 45, 15, 46, 17, 47, 18, 48],
    1959: [19, 50, 18, 49, 19, 50, 20, 51, 22, 52, 23, 53],
    1960: [24, 55, 24, 55, 25, 56, 26, 57, 28, 58, 29, 59],
    1961: [30, 1, 29, 0, 30, 1, 31, 2, 33, 3, 34, 4],
    1962: [35, 6, 34, 5, 35, 6, 36, 7, 38, 8, 39, 9],
    1963: [40, 11, 39, 10, 40, 11, 41, 12, 43, 13, 44, 14],
    1964: [45, 16, 45, 16, 46, 17, 47, 18, 49, 19, 50, 20],
    1965: [51, 22, 50, 21, 51, 22, 52, 23, 54, 24, 55, 25],
    1966: [56, 27, 55, 26, 56, 27, 57, 28, 59, 29, 0, 30],
    1967: [1, 32, 0, 31, 1, 32, 2, 33, 4, 34, 5, 35],
    1968: [6, 37, 6, 37, 7, 38, 8, 39, 10, 40, 11, 41],
    1969: [12, 43, 11, 42, 12, 43, 13, 44, 15, 45, 16, 46],
    1970: [17, 48, 16, 47, 17, 48, 18, 49, 20, 50, 21, 51],
    1971: [22, 53, 21, 52, 22, 53, 23, 54, 25, 55, 26, 56],
    1972: [27, 58, 27, 58, 28, 59, 29, 0, 31, 1, 32, 2],
    1973: [33, 4, 32, 3, 33, 4, 34, 5, 36, 6, 37, 7],
    1974: [38, 9, 37, 8, 38, 9, 39, 10, 41, 11, 42, 12],
    1975: [43, 14, 42, 13, 43, 14, 44, 15, 46, 16, 47, 17],
    1976: [48, 19, 48, 19, 49, 20, 50, 21, 52, 22, 53, 23],
    1977: [54, 25, 53, 24, 54, 25, 55, 26, 57, 27, 58, 28],
    1978: [59, 30, 58, 29, 59, 30, 0, 31, 2, 32, 3, 33],
    1979: [4, 35, 3, 34, 4, 35, 5, 36, 7, 37, 8, 38],
    1980: [9, 40, 9, 40, 10, 41, 11, 42, 13, 43, 14, 44],
    1981: [15, 46, 14, 45, 15, 46, 16, 47, 18, 48, 19, 49],
    1982: [20, 51, 19, 50, 20, 51, 21, 52, 23, 53, 24, 54],
    1983: [25, 56, 24, 55, 25, 56, 26, 57, 28, 58, 29, 59],
    1984: [30, 1, 30, 1, 31, 2, 32, 3, 33, 4, 34, 5],
    1985: [36, 7, 35, 6, 36, 7, 37, 8, 39, 9, 40, 10],
    1986: [41, 12, 40, 11, 41, 12, 42, 13, 44, 14, 45, 15],
    1987: [46, 17, 45, 16, 46, 17, 47, 18, 49, 19, 50, 20],
    1988: [51, 22, 51, 22, 52, 23, 53, 24, 55, 25, 56, 26],
    1989: [57, 28, 56, 27, 57, 28, 58, 29, 0, 30, 1, 31],
    1990: [2, 33, 1, 32, 2, 33, 3, 34, 5, 35, 6, 36],
    1991: [7, 38, 6, 37, 7, 38, 8, 39, 10, 40, 11, 41],
    1992: [12, 43, 12, 43, 13, 44, 14, 45, 16, 46, 17, 47],
    1993: [18, 49, 17, 48, 18, 49, 19, 50, 21, 51, 22, 52],
    1994: [23, 54, 22, 53, 23, 54, 24, 55, 26, 56, 27, 57],
    1995: [28, 59, 27, 58, 28, 59, 29, 0, 31, 1, 32, 2],
    1996: [33, 4, 33, 4, 34, 5, 35, 6, 37, 7, 38, 8],
    1997: [39, 10, 38, 9, 39, 10, 40, 11, 42, 12, 43, 13],
    1998: [44, 15, 43, 14, 44, 15, 45, 16, 47, 17, 48, 18],
    1999: [49, 20, 48, 19, 49, 20, 50, 21, 52, 22, 53, 23],
    2000: [54, 25, 54, 25, 55, 26, 56, 27, 58, 28, 59, 29],
    2001: [0, 31, 59, 30, 0, 31, 1, 32, 3, 33, 4, 34],
    2002: [5, 36, 4, 35, 5, 36, 6, 37, 8, 38, 9, 39],
    2003: [10, 41, 9, 40, 10, 41, 11, 42, 13, 43, 14, 44],
    2004: [15, 46, 15, 46, 16, 47, 17, 48, 19, 49, 20, 50],
    2005: [21, 52, 20, 51, 21, 52, 22, 53, 24, 54, 25, 55],
    2006: [26, 57, 25, 56, 26, 57, 27, 58, 29, 59, 30, 60],
    2007: [31, 2, 30, 1, 31, 2, 32, 3, 34, 4, 35, 5],
    2008: [36, 7, 36, 7, 37, 8, 38, 9, 40, 10, 41, 11],
    2009: [42, 13, 41, 12, 42, 13, 43, 14, 45, 15, 46, 16],
    2010: [47, 18, 46, 17, 47, 18, 48, 19, 50, 20, 51, 21],
    2011: [52, 23, 51, 22, 52, 23, 53, 24, 55, 25, 56, 26],
    2012: [57, 28, 57, 28, 58, 29, 59, 30, 1, 31, 2, 32],
    2013: [3, 34, 2, 33, 3, 34, 4, 35, 6, 36, 7, 37],
    2014: [8, 39, 7, 38, 8, 39, 9, 40, 11, 41, 12, 42],
    2015: [13, 44, 12, 43, 13, 44, 14, 45, 16, 46, 17, 47],
    2016: [18, 49, 18, 49, 19, 50, 20, 51, 22, 52, 23, 53],
    2017: [24, 55, 23, 54, 24, 55, 25, 56, 27, 57, 28, 58],
    2018: [29, 0, 28, 59, 29, 0, 30, 1, 32, 2, 33, 3],
    2019: [34, 5, 33, 4, 34, 5, 35, 6, 37, 7, 38, 8],
    2020: [39, 10, 39, 10, 40, 11, 41, 12, 43, 13, 44, 14],
    2021: [45, 16, 44, 15, 45, 16, 46, 17, 48, 18, 49, 19],
  };

  static animalCharacterMap = {
    1: {
      animal: 'cheetah',
      animalJp: 'チーター',
      character: '持久力のあるチーター',
    },
    2: {
      animal: 'raccoon',
      animalJp: 'たぬき',
      character: '社交的なたぬき',
    },
    3: {
      animal: 'monkey',
      animalJp: '猿',
      character: '活発な猿',
    },
    4: {
      animal: 'koala',
      animalJp: 'コアラ',
      character: '機敏なコアラ',
    },
    5: {
      animal: 'blackpanther',
      animalJp: '黒ヒョウ',
      character: '世話好きな黒ヒョウ',
    },
    6: {
      animal: 'tiger',
      animalJp: 'トラ',
      character: '愛にあふれるトラ',
    },
    7: {
      animal: 'cheetah',
      animalJp: 'チーター',
      character: '機敏なチーター',
    },
    8: {
      animal: 'raccoon',
      animalJp: 'たぬき',
      character: '品格のあるたぬき',
    },
    9: {
      animal: 'monkey',
      animalJp: '猿',
      character: '野望を持った猿',
    },
    10: {
      animal: 'koala',
      animalJp: 'コアラ',
      character: '面倒見の良いコアラ',
    },
    11: {
      animal: 'kojika',
      animalJp: 'こじか',
      character: '誠実なこじか',
    },
    12: {
      animal: 'elephant',
      animalJp: 'ゾウ',
      character: '好感のもたれるゾウ',
    },
    13: {
      animal: 'ookami',
      animalJp: '狼',
      character: 'お調子者の狼',
    },
    14: {
      animal: 'sheep',
      animalJp: 'ひつじ',
      character: '自由気ままなひつじ',
    },
    15: {
      animal: 'monkey',
      animalJp: '猿',
      character: '親分肌の猿',
    },
    16: {
      animal: 'koala',
      animalJp: 'コアラ',
      character: '社交的なコアラ',
    },
    17: {
      animal: 'kojika',
      animalJp: 'こじか',
      character: '大きな志をもったこじか',
    },
    18: {
      animal: 'elephant',
      animalJp: 'ゾウ',
      character: '傷つきやすいゾウ',
    },
    19: {
      animal: 'ookami',
      animalJp: '狼',
      character: 'さすらいの狼',
    },
    20: {
      animal: 'sheep',
      animalJp: 'ひつじ',
      character: '穏やかなひつじ',
    },
    21: {
      animal: 'pegasus',
      animalJp: 'ペガサス',
      character: '物静かなペガサス',
    },
    22: {
      animal: 'pegasus',
      animalJp: 'ペガサス',
      character: '輝く翼を持つペガサス',
    },
    23: {
      animal: 'sheep',
      animalJp: 'ひつじ',
      character: '純粋無垢なひつじ',
    },
    24: {
      animal: 'ookami',
      animalJp: '狼',
      character: '才能溢れる狼',
    },
    25: {
      animal: 'ookami',
      animalJp: '狼',
      character: 'ほのぼのとした狼',
    },
    26: {
      animal: 'sheep',
      animalJp: 'ひつじ',
      character: '努力家のひつじ',
    },
    27: {
      animal: 'pegasus',
      animalJp: 'ペガサス',
      character: '波乱万丈なペガサス',
    },
    28: {
      animal: 'pegasus',
      animalJp: 'ペガサス',
      character: '品格のあるペガサス',
    },
    29: {
      animal: 'sheep',
      animalJp: 'ひつじ',
      character: '挑戦大好きなひつじ',
    },
    30: {
      animal: 'ookami',
      animalJp: '狼',
      character: '適応力のある狼',
    },
    31: {
      animal: 'elephant',
      animalJp: 'ゾウ',
      character: '統率力のあるゾウ',
    },
    32: {
      animal: 'kojika',
      animalJp: 'こじか',
      character: '勤勉なこじか',
    },
    33: {
      animal: 'koala',
      animalJp: 'コアラ',
      character: '動きまわるコアラ',
    },
    34: {
      animal: 'monkey',
      animalJp: '猿',
      character: '世渡り上手な猿',
    },
    35: {
      animal: 'sheep',
      animalJp: 'ひつじ',
      character: '頼りにされるひつじ',
    },
    36: {
      animal: 'ookami',
      animalJp: '狼',
      character: '愛される狼',
    },
    37: {
      animal: 'elephant',
      animalJp: 'ゾウ',
      character: '全力疾走するゾウ',
    },
    38: {
      animal: 'kojika',
      animalJp: 'こじか',
      character: 'エレガントなこじか',
    },
    39: {
      animal: 'koala',
      animalJp: 'コアラ',
      character: '大きな夢を持つコアラ',
    },
    40: {
      animal: 'monkey',
      animalJp: '猿',
      character: '献身的な猿',
    },
    41: {
      animal: 'raccoon',
      animalJp: 'たぬき',
      character: '努力家のたぬき',
    },
    42: {
      animal: 'cheetah',
      animalJp: 'チーター',
      character: '勇敢なチーター',
    },
    43: {
      animal: 'tiger',
      animalJp: 'トラ',
      character: '活発なトラ',
    },
    44: {
      animal: 'blackpanther',
      animalJp: '黒ヒョウ',
      character: 'ロマンチストな黒ヒョウ',
    },
    45: {
      animal: 'koala',
      animalJp: 'コアラ',
      character: '器用で芸達者なコアラ',
    },
    46: {
      animal: 'monkey',
      animalJp: '猿',
      character: '用心深い猿',
    },
    47: {
      animal: 'raccoon',
      animalJp: 'たぬき',
      character: '人情味にあふれるたぬき',
    },
    48: {
      animal: 'cheetah',
      animalJp: 'チーター',
      character: '上品なチーター',
    },
    49: {
      animal: 'tiger',
      animalJp: 'トラ',
      character: 'のんびりしたトラ',
    },
    50: {
      animal: 'blackpanther',
      animalJp: '黒ヒョウ',
      character: '浮き沈みが激しい黒ヒョウ',
    },
    51: {
      animal: 'lion',
      animalJp: 'ライオン',
      character: '自由気ままなライオン',
    },
    52: {
      animal: 'lion',
      animalJp: 'ライオン',
      character: 'リーダー気質のライオン',
    },
    53: {
      animal: 'blackpanther',
      animalJp: '黒ヒョウ',
      character: '人間味あふれる黒ヒョウ',
    },
    54: {
      animal: 'tiger',
      animalJp: 'トラ',
      character: 'ポジティブなトラ',
    },
    55: {
      animal: 'tiger',
      animalJp: 'トラ',
      character: '力強いトラ',
    },
    56: {
      animal: 'blackpanther',
      animalJp: '黒ヒョウ',
      character: 'お気楽な黒ヒョウ',
    },
    57: {
      animal: 'lion',
      animalJp: 'ライオン',
      character: '感情豊かなライオン',
    },
    58: {
      animal: 'lion',
      animalJp: 'ライオン',
      character: '臆病なライオン',
    },
    59: {
      animal: 'blackpanther',
      animalJp: '黒ヒョウ',
      character: '束縛が嫌いな黒ヒョウ',
    },
    60: {
      animal: 'tiger',
      animalJp: 'トラ',
      character: '天使のようなトラ',
    },
  };

  /**
   * 生年月日から動物番号を取得
   * @param {Date} birthDate
   * @returns {number} 動物番号
   */
  static getAnimalNumber(birthDate) {
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    const tempAnimalNumber = (AnimalEntity.numberTable[year][month - 1]);

    if (!tempAnimalNumber) {
      throw new Error('動物番号が見つかりません');
    }

    const animalNumber = tempAnimalNumber + day;

    if (animalNumber > 60) {
      return animalNumber - 60;
    }

    return animalNumber;
  }

  /**
   * 動物番号から動物を取得
   * @param {number} animalNumber
   * @returns {object} 動物
   */
  static getAnimal(animalNumber) {
    return AnimalEntity.animalCharacterMap[animalNumber];
  }

  constructor(birthDate) {
    const animalNumber = AnimalEntity.getAnimalNumber(birthDate);
    const animalCharacter = AnimalEntity.getAnimal(animalNumber);
    this.animal = animalCharacter.animal;
    this.animalJp = animalCharacter.animalJp;
    this.character = animalCharacter.character;
  }
}
