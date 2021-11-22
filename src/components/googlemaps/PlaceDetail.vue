<template>
    <div class="place-detail">
        <el-row class="head-bar">
            <el-col :span="24">
                <el-button
                    plain
                    @click="onClickBack">Back</el-button>
            </el-col>
        </el-row>
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
                    <el-col :span="3">
                        icon
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
                    <el-col :span="3">
                        icon
                    </el-col>
                    <el-col :span="4">
                        <el-tag
                            v-if="placeOpening"
                            type="success">เปิด</el-tag>
                        <el-tag
                            v-else
                            type="danger">ปิด</el-tag>
                    </el-col>
                    <el-col :span="2">
                        <span @click="isWeekDay = !isWeekDay">v</span>
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
                    <el-col :span="3">
                        icon
                    </el-col>
                    <el-col :span="21">
                        <span>{{ placePhoneNumber }}</span>
                    </el-col>
                </el-row>
                <el-row class="place-pluscode">
                    <el-col :span="3">
                        icon
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
                                <span>{{ item.rating }}</span> <span>{{ item.author_name }}</span> <span>{{ item.relative_time_description }}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <span class="review-text">{{ item.text }}</span>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <div
			ref="mapDetail"
			style="width: 100%; height: 865px; display: none;"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'

declare const google: any

export default defineComponent({
	name: 'PlaceDetail',
	props: {
		placeId: {
			type: String,
			default: ''
		}
	},
	setup(props, { emit }) {
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
				}
			})
		}

		const onClickBack = () => {
			emit('onClickBack')
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

			// function
			getPlaceDetail,
			onClickBack
		}
	}
})
</script>

<style lang="scss" scoped>
.place-detail {
    .head-bar {
        margin-bottom: 10px;
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
        }
        .place-open {
            &.place-open-margin {
                margin-bottom: 20px;
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
            }
            .review-text {
                font-size: 14px;
                line-height: 1.5;
            }
        }
    }
}
</style>