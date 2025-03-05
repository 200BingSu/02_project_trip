export interface Meta {
  total_count: number;
  pageable_count: number;
  is_end: boolean;
}

export interface Documents {
  address_name: string;
  address_type: string;
  x: string; //경도(longitude)
  y: string; // 위도(latitude)

  address: Address;
  road_address: RoadAddress;
}

export interface Address {
  address_name: string; // 전체 지번 주소
  region_1depth_name: string; // 지역 1 Depth, 시도 단위
  region_2depth_name: string; // 지역 2 Depth, 구 단위
  region_3depth_name: string; // 지역 3 Depth, 동 단위
  region_3depth_h_name: string; // 지역 3 Depth, 행정동 명칭
  h_code: string; // 행정 코드
  b_code: string; // 법정 코드
  mountain_yn: "Y" | "N"; // 산 여부, Y 또는 N
  main_address_no: string; // 지번 주번지
  sub_address_no: string; // 지번 부번지, 없을 경우 빈 문자열("")
  x: string; // X 좌표값, 경위도인 경우 경도(longitude)
  y: string; // Y 좌표값, 경위도인 경우 위도(latitude)
}

export interface RoadAddress {
  address_name: string; // 전체 도로명 주소
  region_1depth_name: string; // 지역명 1
  region_2depth_name: string; // 지역명 2
  region_3depth_name: string; // 지역명 3
  road_name: string; // 도로명
  underground_yn: "Y" | "N"; // 지하 여부, Y 또는 N
  main_building_no: string; // 건물 본번
  sub_building_no: string; // 건물 부번, 없을 경우 빈 문자열("")
  building_name: string; // 건물 이름
  zone_no: string; // 우편번호(5자리)
  x: string; // X 좌표값, 경위도인 경우 경도(longitude)
  y: string; // Y 좌표값, 경위도인 경우 위도(latitude)
}
