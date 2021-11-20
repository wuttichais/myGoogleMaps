<template>
	<MainLayout title="Google Maps">
		<template #header>
			<el-row
				:gutter="10"
				class="header">
				<el-col :span="9">
					<el-input
						v-model="latitude"
						placeholder="Latitude" />
				</el-col>
				<el-col :span="9">
					<el-input
						v-model="latitude"
						placeholder="Latitude" />
				</el-col>
				<el-col :span="3">
					<el-button
						type="warning"
						class="btn-init-map"
						@click="initMap">S</el-button>
				</el-col>
				<el-col :span="3">
					<!-- <el-button
						type="danger"
						class="btn-geo-location"
						@click="geoLocation">S</el-button> -->
						<el-button
						type="danger"
						class="btn-geo-location"
						@click="getPlaceService">S</el-button>
				</el-col>
			</el-row>
		</template>
		<template #aside>
			<el-row class="origin">
				<el-col
					:span="2"
					style="margin-right: 10px;">
					icon
				</el-col>
				<el-col :span="21">
					<el-input
						v-model="originModel"
						placeholder="Origin"
						id="searchOrigin"
						/>
				</el-col>
			</el-row>
			<el-row class="destination">
				<el-col
					:span="2"
					style="margin-right: 10px;">
					icon
				</el-col>
				<el-col :span="21">
					<el-input
						v-model="destinationModel"
						placeholder="Destination"
						id="searchDestination"
						/>
				</el-col>
			</el-row>
			<el-divider></el-divider>
			<el-row
				class="listview"
				v-for="(item, index) in locationList"
				:key="`item-${index}`">
				<el-col :span="24">
					<el-row class="location">
						<el-col :span="7">
							<img
								alt="Lotus"
								class="image-location"
								:src="item.locationImage" />
						</el-col>
						<el-col :span="17">
							<el-row>
								<el-col
									:span="22"
									class="name-location">
									{{ index + 1}}. 
									<el-tooltip
										class="item"
										effect="dark"
										:content="item.locationName"
										placement="top"
									>
										<span>{{ item.locationName }}</span>
									</el-tooltip>
								</el-col>
								<el-col
									:span="2"
									class="rating-location">
									<div class="rating-box">{{ item.locationRating }}</div>
								</el-col>
							</el-row>
							<el-row>
								<el-col 
									:span="24"
									class="type-location">
									<span>{{ item.locationType }}</span>
								</el-col>
							</el-row>
							<el-row>
								<el-col
									:span="24"
									class="address-location">
									<el-tooltip
										class="item"
										effect="dark"
										:content="item.locationAddress"
										placement="top"
									>
										<span>{{ item.locationAddress }}</span>
									</el-tooltip>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
					<el-row
						class="review"
						v-for="(rItem, rIndex) in item.review"
						:key="`rItem-${rIndex}`">
						<el-col :span="3">
							<img
								alt="Chaokuai"
								class="image-review"
								:src="rItem.reviewImage" />
						</el-col>
						<el-col :span="21">
							<el-row style="margin-bottom: 5px;">
								<el-col :span="24">
									<span class="name-review">{{ rItem.reviewName }} | {{ rItem.reviewDate }}</span>
								</el-col>
							</el-row>
							<el-row>
								<el-col :span="24">
									<span class="text-review">{{ rItem.reviewText }}</span>
								</el-col>
							</el-row>
						</el-col>
					</el-row>
				</el-col>
				<el-divider></el-divider>
			</el-row>
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
import { ElMessage } from 'element-plus'

declare const google: any

interface ReviewI {
	reviewImage: string,
	reviewName: string,
	reviewDate: string,
	reviewText: string
}

interface LocationListI {
	id: number,
	locationImage: string
	locationName: string,
	locationType: string,
	locationAddress: string,
	locationRating: string,
	review: Array<ReviewI>
}

export default defineComponent({
	name: 'GoogleMap',
	components: {
		MainLayout
	},
	setup() {
		const latitude = ref<number>(18.7470863)
		const longitude = ref<number>(98.9576578)
		const locationList = ref<LocationListI[]>([
			{
				id: 1,
				locationImage: require('@/assets/location/lotus.jpg'),
				locationName: 'Tesco Lotus Express',
				locationType: 'ซูเปอร์มาร์เก็ต',
				locationAddress: 'Chang Phuak Rd. (next to Novotel), เมืองเชียงใหม่',
				locationRating: '7.5',
				review: [
					{
						reviewImage: require('@/assets/profile/Chaokuai.jpg'),
						reviewName: 'Chaokuai Blackcat',
						reviewDate: '18 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี แต่พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า เพราะลูกค้าเยอะมาก'
					},
					{
						reviewImage: require('@/assets/profile/latte.jpg'),
						reviewName: 'Latte Hellcat',
						reviewDate: '19 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
				]
			},
			{
				id: 2,
				locationImage: require('@/assets/location/lotus.jpg'),
				locationName: 'Tesco Lotus Express Hangdong new branch',
				locationType: 'ซูเปอร์มาร์เก็ต',
				locationAddress: 'Chang Phuak Rd. (next to Novotel), เมืองเชียงใหม่',
				locationRating: '7.5',
				review: [
					{
						reviewImage: require('@/assets/profile/Chaokuai.jpg'),
						reviewName: 'Chaokuai Blackcat',
						reviewDate: '18 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
					{
						reviewImage: require('@/assets/profile/latte.jpg'),
						reviewName: 'Latte Hellcat',
						reviewDate: '19 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
				]
			},
			{
				id: 3,
				locationImage: require('@/assets/location/lotus.jpg'),
				locationName: 'Tesco Lotus Express',
				locationType: 'ซูเปอร์มาร์เก็ต',
				locationAddress: 'Chang Phuak Rd. (next to Novotel), เมืองเชียงใหม่',
				locationRating: '7.5',
				review: [
					{
						reviewImage: require('@/assets/profile/Chaokuai.jpg'),
						reviewName: 'Chaokuai Blackcat',
						reviewDate: '18 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
					{
						reviewImage: require('@/assets/profile/latte.jpg'),
						reviewName: 'Latte Hellcat',
						reviewDate: '19 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
				]
			},
			{
				id: 4,
				locationImage: require('@/assets/location/lotus.jpg'),
				locationName: 'Tesco Lotus Express',
				locationType: 'ซูเปอร์มาร์เก็ต',
				locationAddress: 'Chang Phuak Rd. (next to Novotel), เมืองเชียงใหม่',
				locationRating: '7.5',
				review: [
					{
						reviewImage: require('@/assets/profile/Chaokuai.jpg'),
						reviewName: 'Chaokuai Blackcat',
						reviewDate: '18 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
					{
						reviewImage: require('@/assets/profile/latte.jpg'),
						reviewName: 'Latte Hellcat',
						reviewDate: '19 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
				]
			},
			{
				id: 5,
				locationImage: require('@/assets/location/lotus.jpg'),
				locationName: 'Tesco Lotus Express',
				locationType: 'ซูเปอร์มาร์เก็ต',
				locationAddress: 'Chang Phuak Rd. (next to Novotel), เมืองเชียงใหม่',
				locationRating: '7.5',
				review: [
					{
						reviewImage: require('@/assets/profile/Chaokuai.jpg'),
						reviewName: 'Chaokuai Blackcat',
						reviewDate: '18 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
					{
						reviewImage: require('@/assets/profile/latte.jpg'),
						reviewName: 'Latte Hellcat',
						reviewDate: '19 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
				]
			},
			{
				id: 6,
				locationImage: require('@/assets/location/lotus.jpg'),
				locationName: 'Tesco Lotus Express',
				locationType: 'ซูเปอร์มาร์เก็ต',
				locationAddress: 'Chang Phuak Rd. (next to Novotel), เมืองเชียงใหม่',
				locationRating: '7.5',
				review: [
					{
						reviewImage: require('@/assets/profile/Chaokuai.jpg'),
						reviewName: 'Chaokuai Blackcat',
						reviewDate: '18 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
					{
						reviewImage: require('@/assets/profile/latte.jpg'),
						reviewName: 'Latte Hellcat',
						reviewDate: '19 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
				]
			},
			{
				id: 7,
				locationImage: require('@/assets/location/lotus.jpg'),
				locationName: 'Tesco Lotus Express',
				locationType: 'ซูเปอร์มาร์เก็ต',
				locationAddress: 'Chang Phuak Rd. (next to Novotel), เมืองเชียงใหม่',
				locationRating: '7.5',
				review: [
					{
						reviewImage: require('@/assets/profile/Chaokuai.jpg'),
						reviewName: 'Chaokuai Blackcat',
						reviewDate: '18 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
					{
						reviewImage: require('@/assets/profile/latte.jpg'),
						reviewName: 'Latte Hellcat',
						reviewDate: '19 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
				]
			},
			{
				id: 8,
				locationImage: require('@/assets/location/lotus.jpg'),
				locationName: 'Tesco Lotus Express',
				locationType: 'ซูเปอร์มาร์เก็ต',
				locationAddress: 'Chang Phuak Rd. (next to Novotel), เมืองเชียงใหม่',
				locationRating: '7.5',
				review: [
					{
						reviewImage: require('@/assets/profile/Chaokuai.jpg'),
						reviewName: 'Chaokuai Blackcat',
						reviewDate: '18 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
					{
						reviewImage: require('@/assets/profile/latte.jpg'),
						reviewName: 'Latte Hellcat',
						reviewDate: '19 พฤศจิกายน 2564',
						reviewText: 'พนักงานบริการดี พนักงานน้อยไปหน่อย ทำให้เวลาจ่ายเงินค่อนข้างช้า'
					},
				]
			},
		])
		const googleMap = ref(null)
		const mapPosition = computed(() => ({
			lat: Number(latitude.value),
			lng: Number(longitude.value)
		}))
		const showDialogError = ref<boolean>(false)
		const errorMessage = ref<string>('')
		const originModel = ref<string>('')
		const destinationModel = ref<string>('')
		const originLat = ref<number>(0)
		const originLng = ref<number>(0)
		const destinationLat = ref<number>(0)
		const destinationLng = ref<number>(0)

		// const loader = new Loader({ apiKey: 'AIzaSyCZ1BCe4Q7YL1nCa_ovtet4Bjn52tT20T8' }) // CLBS Key
		// const loader = new Loader({ apiKey: 'AIzaSyCKGaEKD2nxmw6K3B_TD1FnhKIAIZeaOH8' }) // My key
		

		onMounted(async () => {
			initMap()
		})

		const initMap = () => {
			const directionsService = new google.maps.DirectionsService()
  			const directionsRenderer = new google.maps.DirectionsRenderer()

			// await loader.load()
			const map = new google.maps.Map(googleMap.value, {
				center: mapPosition.value,
				zoom: 15,
			})

			new google.maps.Marker({
				position: mapPosition.value,
				map,
				title: 'Hello World!',
			})

			// Input Autocomplete Origin
			const autocompleteOrigin = new google.maps.places.Autocomplete((document.getElementById('searchOrigin')), {
				types: ['geocode']
			})

			const markerOrigin = new google.maps.Marker({
				anchorPoint: new google.maps.Point(0, -29)
			})

			google.maps.event.addListener(autocompleteOrigin, 'place_changed', () => {
				const place = autocompleteOrigin.getPlace()

				originLat.value = place.geometry.location.lat()
				originLng.value = place.geometry.location.lng()

				if (place.geometry.viewport) {
					map.fitBounds(place.geometry.viewport)
				} else {
					map.setCenter(place.geometry.location)
					map.setZoom(17)
				}
				markerOrigin.setPosition(place.geometry.location)
				markerOrigin.setVisible(true)

				markerOrigin.setMap(map)

				directionsRenderer.setMap(map)
				displayRoute(directionsService, directionsRenderer)
			})
			
			// Input Autocomplete Destination
			const autocompleteDestination = new google.maps.places.Autocomplete((document.getElementById('searchDestination')), {
				types: ['geocode']
			})
			const markerDestination = new google.maps.Marker({
				anchorPoint: new google.maps.Point(0, -29)
			})
			google.maps.event.addListener(autocompleteDestination, 'place_changed', () => {
				const place = autocompleteDestination.getPlace()

				destinationLat.value = place.geometry.location.lat()
				destinationLng.value = place.geometry.location.lng()

				if (place.geometry.viewport) {
					map.fitBounds(place.geometry.viewport)
				} else {
					map.setCenter(place.geometry.location)
					map.setZoom(17)
				}
				markerDestination.setPosition(place.geometry.location)
				markerDestination.setVisible(true)

				markerDestination.setMap(map)

				directionsRenderer.setMap(map)
				displayRoute(directionsService, directionsRenderer)
			})
		}

		const geoLocation = () => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(position => {
					latitude.value = position.coords.latitude
					longitude.value = position.coords.longitude
					initMap()
				},
				error => {
					errorMessage.value = error.message
					showDialogError.value = true
				})
			}
		}

		const displayRoute = (directionsService: any, directionsRenderer: any) => {
			
			if (originModel.value === '' || destinationModel.value === '') return

			const originLocation = { lat: originLat.value, lng: originLng.value }
			const destinationLocation = { lat: destinationLat.value, lng: destinationLng.value }

			directionsService
				.route({
					origin: originLocation,
					destination: destinationLocation,
					travelMode: 'DRIVING',
				})
				.then((response: any) => {
					directionsRenderer.setDirections(response)
				})
				.catch(() =>
					ElMessage({
						showClose: true,
						message: 'Directions request failed',
						type: 'error',
						duration: 5000
					})
				)
		}

		const getPlaceService = () => {
			const map = new google.maps.Map(googleMap.value, {
				center: mapPosition.value,
				zoom: 15,
			})

			// const london = new google.maps.LatLng(51.5, -0.1)
			const cnxTH = new google.maps.LatLng(18.7943239, 98.9214578)
			const req = {
				location: cnxTH,
				radius: '5000',
				types: ['cafe']
			}

			const service = new google.maps.places.PlacesService(map)

			service.nearbySearch(req, callback)
		}

		const callback = (result: any, status: any) => {
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				console.log('result -->', result)
			}
		}

		return {
			// data
			latitude,
			longitude,
			locationList,
			googleMap,
			mapPosition,
			showDialogError,
			errorMessage,
			originModel,
			destinationModel,
			originLat,
			originLng,
			destinationLat,
			destinationLng,
			
			// function
			initMap,
			geoLocation,
			displayRoute,
			getPlaceService,
			callback
		}
	}
})
</script>

<style lang="scss" scoped>
.header {
	.label-latitude {
		font-size: 12px;
		font-weight: 700;
		color: #989898;
		margin-left: 5px;
	}
	.label-longitude {
		font-size: 12px;
		font-weight: 700;
		color: #989898;
		margin-left: 5px;
	}
	.btn-init-map, .btn-geo-location {
		padding: unset;
		width: 60px;
	}
}
.origin {
	margin-bottom: 10px;
	display: flex;
	align-items: center;
}
.destination {
	display: flex;
	align-items: center;
}
.listview {
	font-size: 14px;
	.location {
		margin-bottom: 10px;
		.image-location {
			width: 100px;
			height: 85px;
			border-radius: 5px;
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
		}
		.address-location {
			color: #989898;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
			margin-bottom: 10px;
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
	.review {
		font-size: 12px;
		margin-bottom: 10px;
		.image-review {
			width: 40px;
			height: 38px;
			border-radius: 5px;
		}
		.name-review {
			color: #989898;
			margin-bottom: 10px;
		}
	}
}
</style>
