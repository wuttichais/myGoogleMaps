<template>
	<MainLayout title="Google Maps">
		<template #header>
			<el-row
				:gutter="10"
				class="header">
				<el-col :span="8">
					<el-input
						v-model="latitude"
						placeholder="Latitude">
						<template #prepend>Lat</template>
					</el-input>
				</el-col>
				<el-col :span="8">
					<el-input
						v-model="longitude"
						placeholder="Longitude">
						<template #prepend>Lng</template>
					</el-input>
				</el-col>
				<el-col :span="2">
					<el-button
						type="warning"
						class="btn-init-map"
						@click="initMapGoogle">S</el-button>
				</el-col>
				<el-col :span="2">
					<el-button
						type="danger"
						class="btn-geo-location"
						@click="geoLocation">S</el-button>
				</el-col>
			</el-row>
		</template>
		<template
			v-if="!isPlaceDetail"
			#aside>
			<el-row class="category-text">
				<el-col :span="24">
					<span>Search this area with: 
						<el-popover
							v-model:visible="visibleSearchArea"
							trigger="manual"
							placement="right"
							:width="350">
							<el-row>
								<el-col
									:span="15"
									style="display: flex; align-items: center;">
									<span>Search this area with: <span style="font-weight: 700; color: #006eff;">{{ categorySearchLabel }}</span></span>
								</el-col>
								<el-col :span="9">
									<el-button
										size="mini"
										type="text"
										@click="visibleSearchArea = false">cancel</el-button>
									<el-button
										type="primary"
										size="mini"
										@click="visibleSearchArea = false, getPlaceService(categorySearchLabel, categorySearchValue)">confirm</el-button>
								</el-col>
							</el-row>
							<template #reference>
								<el-tag
									size="small"
									effect="dark">{{ categorySearchLabel }}</el-tag>
									<!-- <el-button @click="visible = true">Delete</el-button> -->
							</template>
						</el-popover>
					</span>
				</el-col>
			</el-row>
			<el-row
				class="category-search">
				<el-col
					v-for="(item, index) in categorySearchList"
					:key="`item-${index}`"
					:span="4"
					class="category-col">
					<el-button
						type="info"
						size="medium"
						class="btn-category"
						plain
						@click="getPlaceService(item.label, item.value)">{{ item.label }}</el-button>
				</el-col>
			</el-row>
			<el-divider></el-divider>
			<el-row
				class="listview"
				v-for="(item, index) in locationList"
				:key="`item-${index}`"
				@click="showMarker(item)">
				<el-col :span="24">
					<el-row class="location">
						<el-col :span="7">
							<img
								alt="Lotus"
								class="image-location"
								:src="item.placePhotos ? item.placePhotos : require('@/assets/no-image.jpg')" />
						</el-col>
						<el-col :span="17">
							<el-row>
								<el-col
									:span="21"
									class="name-location">
									{{ index + 1 }}. 
									<el-tooltip
										class="item"
										effect="dark"
										:content="item.name"
										placement="top"
									>
										<span>{{ item.name }}</span>
									</el-tooltip>
								</el-col>
								<el-col
									:span="3"
									class="rating-location">
									<div class="rating-box">{{ item.rating ? item.rating : '-' }}</div>
								</el-col>
							</el-row>
							<el-row>
								<el-col 
									:span="24"
									class="type-location">
									<span
										v-for="(tItem, tIndex) in item.types"
										:key="`t-${tIndex}`">
										<span v-if="tIndex != 0">, </span><span>{{ tItem }}</span>	
									</span>
								</el-col>
							</el-row>
							<el-row>
								<el-col
									:span="24"
									class="address-location">
									<span>{{ item.vicinity }}</span>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</template>
		<template
			v-else
			#aside>
				<PlaceDetail
					:placeId="placeId"
					@onClickBack="onClickBack"
				/>
		</template>
		<div
			ref="googleMap"
			style="width: 100%; height: 865px;"></div>
	</MainLayout>
	<el-dialog
		v-model="showDialogError"
		title="Notice"
		width="380px"
		:show-close="false"
	>
		<p>{{ errorMessage }}</p>
		<p>Please allow access to your location.</p>
		<span>
			<el-link
				type="primary"
				href="https://support.google.com/chrome/answer/114662?hl=en&co=GENIE.Platform%3DDesktop&oco=0"
				target="_blank">https://support.google.com</el-link>
		</span>
		<template #footer>
		<span class="dialog-footer">
			<el-button
				type="primary"
				@click="showDialogError = false">OK</el-button>
		</span>
		</template>
	</el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
// import { Loader } from '@googlemaps/js-api-loader'
import MainLayout from '@/layout/MainLayout.vue'
import PlaceDetail from '@/components/googlemaps/PlaceDetail.vue'

declare const google: any

export default defineComponent({
	name: 'GoogleMap',
	components: {
		MainLayout,
		PlaceDetail,
	},
	setup() {
		const latitude = ref<number>(18.7470863)
		const longitude = ref<number>(98.9576578)
		const locationList = ref([])
		const googleMap = ref(null)
		const showDialogError = ref<boolean>(false)
		const errorMessage = ref<string>('')
		const isPlaceDetail = ref<boolean>(false)
		const placeId = ref<string>('')
		const categorySearchList = ref([
			{ id: 1, label: 'Cafe', value: 'cafe' },
			{ id: 2, label: 'Bar', value: 'bar' },
			{ id: 3, label: 'Atm', value: 'atm' },
			{ id: 4, label: 'Gym', value: 'gym' },
			{ id: 5, label: 'Spa', value: 'spa' },
		])
		const categorySearchLabel = ref<string>('')
		const categorySearchValue = ref<string>('')
		const visibleSearchArea = ref<boolean>(false)

		// const loader = new Loader({ apiKey: 'AIzaSyCZ1BCe4Q7YL1nCa_ovtet4Bjn52tT20T8' }) // CLBS Key
		// const loader = new Loader({ apiKey: 'AIzaSyCKGaEKD2nxmw6K3B_TD1FnhKIAIZeaOH8' }) // My key
		
		onMounted(async () => {
			initMapGoogle()
			getPlaceService('Cafe', 'cafe')
		})

		const mapPosition = computed(() => ({
			lat: Number(latitude.value),
			lng: Number(longitude.value)
		}))

		const initMapGoogle = async () => {
			// await loader.load()
			const map = new google.maps.Map(googleMap.value, {
				center: mapPosition.value,
				zoom: 15,
			})

			new google.maps.Marker({
				position: mapPosition.value,
				map,
				
			})

			map.addListener('center_changed', () => {
				if (!visibleSearchArea.value) {
					visibleSearchArea.value = true
				}
				const mylat = map.getCenter().lat()
				const mylng = map.getCenter().lng()
				latitude.value = mylat
				longitude.value = mylng
			})
		}

		const geoLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(position => {
					latitude.value = position.coords.latitude
					longitude.value = position.coords.longitude
					initMapGoogle()
				},
				error => {
					errorMessage.value = error.message
					showDialogError.value = true
				})
			}
		}

		const getPlaceService = async (label: string, value: string) => {
			categorySearchLabel.value = label
			categorySearchValue.value = value
			// await loader.load()
			const map = new google.maps.Map(googleMap.value, {
				center: mapPosition.value,
				zoom: 15,
			})

			const req = {
				location: mapPosition.value,
				radius: '1000',
				types: [value]
			}

			const service = new google.maps.places.PlacesService(map)

			service.nearbySearch(req, getAllPlaces)
		}

		const getAllPlaces = (placesArray: any, status: any) => {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				locationList.value = placesArray
				const map = new google.maps.Map(googleMap.value, {
					center: mapPosition.value,
					zoom: 16
				})
				
				const infoWindow = new google.maps.InfoWindow()
				locationList.value.forEach((item: any, index: number) => {
					const marker = new google.maps.Marker({
						position: { lat: item.geometry.location.lat(), lng: item.geometry.location.lng()},
						map,
						label: `${index + 1}`
					})

					marker.addListener('click', () => {
						infoWindow.close()
						infoWindow.setContent(item.name)
						infoWindow.open(marker.getMap(), marker)
					})

					if (item.photos) {
						item['placePhotos'] = item.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})
					}
				})
				map.addListener('center_changed', () => {
					if (visibleSearchArea.value === false) {
						visibleSearchArea.value = true
					}
					const mylat = map.getCenter().lat()
					const mylng = map.getCenter().lng()
					latitude.value = mylat
					longitude.value = mylng
				})
			}
		}

		const showMarker = (item: any) => {
			isPlaceDetail.value = true
			placeId.value = item.place_id
			const map = new google.maps.Map(googleMap.value, {
				center: mapPosition.value,
				zoom: 17
			})
			const infoWindow = new google.maps.InfoWindow()
			const marker = new google.maps.Marker({
				position: { lat: item.geometry.location.lat(), lng: item.geometry.location.lng()},
				map,
			})
			infoWindow.setContent(item.name)
			infoWindow.open(marker.getMap(), marker)
		}

		const onClickBack = () => {
			isPlaceDetail.value = false
			getPlaceService('Cafe', 'cafe')
		}
		

		return {
			// data
			latitude,
			longitude,
			locationList,
			googleMap,
			showDialogError,
			errorMessage,
			placeId,
			isPlaceDetail,
			categorySearchList,
			categorySearchLabel,
			categorySearchValue,
			visibleSearchArea,

			// computed
			mapPosition,
			
			// function
			initMapGoogle,
			geoLocation,
			getPlaceService,
			getAllPlaces,
			showMarker,
			onClickBack,
		}
	}
})
</script>

<style lang="scss" scoped>
.header {
	.btn-init-map, .btn-geo-location {
		padding: unset;
		width: 50px;
	}
}
.category-text {
	font-size: 14px;
	font-weight: 700;
	margin-left: 20px;
}
.category-search {
	margin-top: 15px;
	padding-left: 20px;
	.category-col {
		margin-right: 13px;
	}
	.btn-category {
		width: 70px;
	}
}
.listview {
	font-size: 14px;
	padding: 20px 0px;
	border-bottom: 1px solid #989898;
	cursor: pointer;
	.location {
		margin-bottom: 10px;
		.image-location {
			width: 100px;
			height: 90px;
			border-radius: 5px;
			margin-left: 15px;
		}
		.name-location {
			font-size: 16px;
			font-weight: 700;
			line-height: 2;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.type-location {
			color: #989898;
			line-height: 1.5;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
		.address-location {
			color: #989898;
		}
		.rating-location {
			position: relative;
			.rating-box {
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
				position: absolute;
				top: 0;
				left: 0;
			}
		}
	}
}
.listview:hover {
	background: #e6e5f0;
}
</style>
