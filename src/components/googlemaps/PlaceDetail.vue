<template>
    <div class="place-detail">
        <el-row class="head-bar">
            <el-col :span="18">
                <el-button
                    v-show="!isDistance"
                    plain
                    class="btn-back"
                    @click="$emit('onClickBack')">
                        <fa
                            icon="arrow-left"
                            class="arrow-left-icon"
                            /> Back
                </el-button>
            </el-col>
            <el-col
                v-if="!isDistance"
                :span="6">
                <el-button
                    plain
                    class="btn-back"
                    @click="isDistance = true">
                        Distance
                        <fa
                            icon="road"
                            class="road-icon"/> 
                </el-button>
            </el-col>
            <el-col
                v-else
                :span="6"
                style="display: flex; justify-content: center;">
                <el-button
                    plain
                    class="btn-back"
                    @click="isDistance = false">
                        Close
                        <fa
                            icon="times-circle"
                            class="times-circle-icon"/> 
                            </el-button>
            </el-col>
        </el-row>
        <div v-if="!isDistance">
            <el-row class="place-image">
                <el-col :span="24">
                    <img
                        v-if="placePhoto.length === 0"
                        alt="Lotus"
                        class="image-location"
                        :src="require('@/assets/no-image.jpg')" />
                    <el-carousel
                        v-else
                        :interval="5000"
                        type="card"
                        height="400px">
                        <el-carousel-item
                            v-for="(item, index) in placePhoto"
                            :key="`item-${index}`">
                            <img
                                alt="location-image"
                                class="image-location"
                                :src="item" />
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
            <el-row class="detail">
                <el-col :span="24">
                    <el-row>
                        <el-col :span="22">
                            <span class="place-name">{{ placeName }}</span>
                        </el-col>
                        <el-col :span="2">
                            <div class="place-rating">{{ placeRating ? placeRating : '-' }}</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col
                            :span="24"
                            class="place-types">
                            <span
                                v-for="(tItem, tIndex) in placeTypes"
                                :key="`t-${tIndex}`"
                                >
                                <span v-if="tIndex != 0">, </span><span>{{ tItem }}</span>	
                            </span>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row class="place-address">
                        <el-col
                            class="col-icon"
                            :span="3">
                            <fa
                                icon="map-marker-alt"
                                class="map-marker-alt-icon"
                                />
                        </el-col>
                        <el-col :span="21">
                            <span>
                                {{ placeAddress }}
                            </span>
                        </el-col>
                    </el-row>
                    <el-row
                        class="place-open"
                        :class="isWeekDay ? '' : 'place-open-margin'">
                        <el-col
                            class="col-icon"
                            :span="3">
                            <fa
                                icon="clock"
                                class="clock-icon"
                                />
                        </el-col>
                        <el-col :span="3">
                            <el-tag
                                v-if="placeOpening"
                                type="success">เปิด</el-tag>
                            <el-tag
                                v-else
                                type="danger">ปิด</el-tag>
                        </el-col>
                        <el-col
                            class="col-icon"
                            :span="2">
                            <span
                                class="arrow-icon"
                                @click="isWeekDay = !isWeekDay">
                                <fa
                                    v-if="!isWeekDay"
                                    icon="chevron-down"
                                    class="chevron-down-icon"
                                    />
                                <fa
                                    v-else
                                    icon="chevron-up"
                                    class="chevron-up-icon"
                                    />
                            </span>
                        </el-col>
                    </el-row>
                    <el-row
                        v-if="isWeekDay"
                        class="place-weekday">
                        <el-col
                            :offset="2"
                            :span="22">
                            <ul class="a">
                                <li
                                    v-for="(item, index) in placeWeekdayText"
                                    :key="`item-${index}`">
                                    <span class="week-text">{{ item }}</span></li>
                            </ul>
                        </el-col>
                    </el-row>
                    <el-row class="place-phonenumber">
                        <el-col
                            class="col-icon"
                            :span="3">
                            <fa
                                icon="phone-alt"
                                class="phone-alt-icon"
                                />
                        </el-col>
                        <el-col :span="21">
                            <span>{{ placePhoneNumber }}</span>
                        </el-col>
                    </el-row>
                    <el-row class="place-pluscode">
                        <el-col
                            class="col-icon"
                            :span="3">
                            <fa
                                icon="globe"
                                class="globe-icon"
                                />
                        </el-col>
                        <el-col :span="21">
                            <span>
                                {{ placePlusCode }}
                            </span>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row class="review">
                        <el-col :span="24">
                            <span>ความคิดเห็น</span>
                        </el-col>
                    </el-row>
                    <el-row
                        v-for="(item, index) in placeReview"
                        :key="`index-${index}`"
                        class="review-detail">
                        <el-col :span="4">
                            <img
                                alt="Lotus"
                                class="image-profile"
                                :src="item.profile_photo_url ? item.profile_photo_url : require('@/assets/no-image.jpg')" />
                        </el-col>
                        <el-col :span="20">
                            <el-row>
                                <el-col
                                    :span="24"
                                    class="profile-name">
                                    <span>{{ item.rating }}</span>
                                    <fa
                                        icon="star"
                                        class="star-icon"
                                        />
                                    <span> {{ item.author_name }}</span>
                                    <fa
                                        icon="circle"
                                        class="circle-icon"
                                        />
                                    <span> {{ item.relative_time_description }}</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <span class="review-text">" {{ item.text }} "</span>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <div
            v-else
            class="distance">
            <el-row class="origin">
                <el-col
                    class="col-icon"
                    :span="3">
                    <fa
                        icon="crosshairs"
                        class="crosshairs-icon"
                        />
                </el-col>
                <el-col :span="20">
                    <el-input
                        v-model="originGeo"
                        placeholder="Origin" />
                </el-col>
                <fa
                    icon="ellipsis-v"
                    class="ellipsis-v-icon"
                />
            </el-row>
            <el-row class="destination">
                <el-col
                    class="col-icon"
                    :span="3">
                    <fa
                        icon="map-marker-alt"
                        class="map-marker-alt-icon"
                        />
                </el-col>
                <el-col :span="20">
                    <el-input
                        v-model="destinationGeo"
                        placeholder="Destination" />
                </el-col>
            </el-row>
            <el-row class="calculte">
                <el-col
                    :offset="3"
                    :span="21">
                    <el-button
                    plain
                    type="primary"
                    class="btn-back"
                    @click="distanceCalculate">
                        Calculate
                        <fa
                            icon="calculator"
                            class="calculator-icon"/> 
                </el-button>
                </el-col>
            </el-row>
            <el-row class="distance-detail">
                <el-col
                    :offset="3"
                    :span="21">
                    <el-row class="title">
                        <el-col :span="24">
                            <span>Distance Detail</span>
                        </el-col>
                    </el-row>
                    <el-row class="distance-kilo">
                        <el-col :span="18">
                            <span>Distance In Kilometer:</span>
                        </el-col>
                        <el-col
                            v-show="distanceInKilo"
                            class="kilo"
                            :span="6">
                            <el-tag
                                size="small"
                                effect="dark">{{ distanceInKilo }}</el-tag>
                        </el-col>
                    </el-row>
                    <el-row class="distance-mile">
                        <el-col :span="18">
                            <span>Distance In Mile:</span>
                        </el-col>
                        <el-col
                            v-show="distanceInMile"
                            class="mile"
                            :span="6">
                            <el-tag
                                size="small"
                                effect="dark">{{ distanceInMile }}</el-tag>
                        </el-col>
                    </el-row>
                    <el-row class="duration-minute">
                        <el-col :span="18">
                            <span>Duration In Minute:</span>
                        </el-col>
                        <el-col
                            v-show="durationInMinute"
                            class="minute"
                            :span="6">
                            <el-tag
                                size="small"
                                effect="dark">{{ durationInMinute }}</el-tag>
                        </el-col>
                    </el-row>
                    <el-row class="duration-second">
                        <el-col :span="18">
                            <span>Duration In Second:</span>
                        </el-col>
                        <el-col
                            v-show="durationInSecond"
                            class="second"
                            :span="6">
                            <el-tag
                                size="small"
                                effect="dark">{{ durationInSecond }}</el-tag>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <div
			ref="mapDetail"
			style="width: 100%; height: 865px; display: none;"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

declare const google: any

interface PlaceLocationI {
    lat: number,
    lng: number
}

export default defineComponent({
	name: 'PlaceDetail',
	props: {
		placeId: {
			type: String,
			default: ''
		}
	},
	setup(props) {
		const mapDetail = ref<any>(null)
		const placeName = ref<string>('')
		const placeRating = ref<number>(0)
		const placeTypes = ref<string[]>([])
		const placeAddress = ref<string>('')
		const placePhoneNumber = ref<string>('')
		const placePlusCode = ref<string>('')
		const placeOpening = ref<boolean>(false)
		const placeWeekdayText = ref<string[]>([])
		const placePhoto = ref<any[]>([])
		const placeReview = ref<any[]>([])
		const isWeekDay = ref<boolean>(false)
		const originLocation = ref<PlaceLocationI>({
			lat: 0,
			lng: 0
		})
		const destinationLocation = ref<PlaceLocationI>({
			lat: 0,
			lng: 0
		})
		const isDistance = ref<boolean>(false)
		const originGeo = ref<string>('Your Position')
		const destinationGeo = ref<string>('')
		const distanceInKilo = ref<string>('')
		const distanceInMile = ref<string>('')
		const durationInMinute = ref<string>('')
		const durationInSecond = ref<number>()

		onMounted(async () => {
			getPlaceDetail()
		})

		const getPlaceDetail = () => {
			const map = new google.maps.Map(mapDetail.value, {
				center: { lat: 18.7470863, lng: 98.9576578 },
				zoom: 16
			})

			const service = new google.maps.places.PlacesService(map)

			const req = {
				placeId: props.placeId
			}

			service.getDetails(req, (placeDetail: any, status: any) => {
				if (status == google.maps.places.PlacesServiceStatus.OK) {
					placeName.value = placeDetail.name
					placeRating.value = placeDetail.rating
					placeTypes.value = placeDetail.types
					placeAddress.value = placeDetail.formatted_address
					placePhoneNumber.value = placeDetail.international_phone_number ? placeDetail.international_phone_number : '-'
					placePlusCode.value = placeDetail.plus_code ? placeDetail.plus_code.compound_code : '-'
					placeReview.value = placeDetail.reviews ? placeDetail.reviews : []
					placeOpening.value = placeDetail.opening_hours ? placeDetail.opening_hours.isOpen() : false
					placeWeekdayText.value = placeDetail.opening_hours ? placeDetail.opening_hours.weekday_text : false

					if (placeDetail.photos) {
						placeDetail.photos.map((item: any) => {
							const imgUrl = item.getUrl({'maxWidth': 100, 'maxHeight': 100})
							placePhoto.value.push(imgUrl)
						})
					}

					destinationLocation.value.lat = placeDetail.geometry.location.lat()
					destinationLocation.value.lng = placeDetail.geometry.location.lng()
					destinationGeo.value = placeDetail.name
				}
			})
		}
        
		const distanceCalculate = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(position => {
					originLocation.value.lat = position.coords.latitude
					originLocation.value.lng = position.coords.longitude

					const service = new google.maps.DistanceMatrixService()

					const origin = { lat: originLocation.value.lat, lng: originLocation.value.lng }
					const destination = { lat: destinationLocation.value.lat, lng: destinationLocation.value.lng }
			
					const request = {
						origins: [origin],
						destinations: [destination],
						travelMode: google.maps.TravelMode.DRIVING,
						unitSystem: google.maps.UnitSystem.METRIC,
						avoidHighways: false,
						avoidTolls: false,
					}

					JSON.stringify(request, null, 2)

					service.getDistanceMatrix(request).then((response: any) => {
						const distance = response.rows[0].elements[0].distance
						const duration = response.rows[0].elements[0].duration
						distanceInKilo.value = (distance.value / 1000).toFixed(2)
						distanceInMile.value = (distance.value / 1609.34).toFixed(2)
						durationInMinute.value = (duration.value / 60).toFixed(2)
						durationInSecond.value = duration.value
					})
				},
				error => {
					ElMessage({
						showClose: true,
						message: error.message,
						type: 'error',
					})
				})
			}
		}

		return {
			// data
			mapDetail,
			placeName,
			placeRating,
			placeTypes,
			placeAddress,
			placePhoneNumber,
			placePlusCode,
			placeOpening,
			placeWeekdayText,
			placePhoto,
			placeReview,
			isWeekDay,
			originLocation,
			destinationLocation,
			isDistance,
			originGeo,
			destinationGeo,
			distanceInKilo,
			distanceInMile,
			durationInMinute,
			durationInSecond,

			// function
			getPlaceDetail,
			distanceCalculate,
		}
	}
})
</script>

<style lang="scss" scoped>
.place-detail {
    padding-top: 15px;
    .head-bar {
        margin-bottom: 10px;
        .btn-back {
            padding: 12px 18px;
            .arrow-left-icon {
                margin-right: 5px;
                font-size: 14px;
            }
        }
    }
    .place-image {
        background: rgb(238, 238, 238);
        border-radius: 10px;
        .image-location {
            width: 100%;
            border-radius: 8px;
            margin-top: 50px;
        }
    }
    .detail {
        padding: 20px;
        .place-name {
            font-size: 24px;
            font-weight: 700;
        }
        .place-rating {
            width: 30px;
            height: 30px;
            font-size: 14px;
            font-weight: 700;
            color: #ffffff;
            border-radius: 5px;
            background: #67C23A;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .place-types {
            font-size: 12px;
            color: #989898;
            line-height: 1.5;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .place-address {
            margin-bottom: 20px;
            .col-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                .map-marker-alt-icon {
                    font-size: 24px;
                    color: #006eff;
                }
            }
        }
        .place-open {
            &.place-open-margin {
                margin-bottom: 20px;
            }
            .col-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                .clock-icon {
                    font-size: 20px;
                    color: #006eff;
                }
                .arrow-icon {
                    cursor: pointer;
                }
            }
        }
        .place-weekday {
            .week-text {
                font-weight: 700;
                line-height: 1.8;
                color: #636262;
            }
        }
        .place-phonenumber {
            margin-bottom: 20px;
            .col-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                .phone-alt-icon {
                    font-size: 20px;
                    color: #006eff;
                }
            }
        }
        .place-pluscode {
            margin-bottom: 20px;
            .col-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                .globe-icon {
                    font-size: 20px;
                    color: #006eff;
                }
            }
        }
        .review {
            margin-bottom: 20px;
            font-weight: 700;
        }
        .review-detail {
            margin-bottom: 15px;
            .image-profile {
                width: 50px;
                height: 48px;
                border-radius: 5px;
            }
            .profile-name {
                font-size: 14px;
                font-weight: 700;
                color: #989898;
                .star-icon {
                    font-size: 9px;
                    margin-bottom: 2px;
                    margin-right: 5px;
                    color: rgb(252, 206, 1);
                }
                .circle-icon {
                    font-size: 5px;
                    margin: 0px 5px 3px 5px;
                }
            }
            .review-text {
                font-size: 14px;
                line-height: 1.5;
            }
        }
    }
}
.distance {
    .origin {
        position: relative;
        margin-bottom: 20px;
        margin-top: 20px;
        .col-icon {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ellipsis-v-icon {
            position: absolute;
            top: 39px;
            left: 26px;
            font-size: 20px;
        }
    }
    .destination {
        margin-bottom: 20px;
        .col-icon {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .calculte {
        margin-bottom: 20px;
    }
    .distance-detail {
        font-size: 14px;
        font-weight: 700;
        color: #989898;
        .title {
            margin-bottom: 20px;
            font-size: 16px;
            color: #000000;
        }
        .distance-kilo {
            margin-left: 10px;
            margin-bottom: 10px;
        }
        .distance-mile {
            margin-left: 10px;
            margin-bottom: 10px;
        }
        .duration-minute {
            margin-left: 10px;
            margin-bottom: 10px;
        }
        .duration-second {
            margin-left: 10px;
            margin-bottom: 10px;
        }
    }
}
</style>