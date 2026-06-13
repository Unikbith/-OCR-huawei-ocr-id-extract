from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from huaweicloudsdkcore.auth.credentials import BasicCredentials
from huaweicloudsdkocr.v1.region.ocr_region import OcrRegion
from huaweicloudsdkcore.exceptions import exceptions
from huaweicloudsdkocr.v1 import *


def init_ocr_client():
    """初始化华为云 OCR 客户端"""
    ak = 'VMTQLE9B2JON7CZFH398'
    sk = 'JlklRyFtFJRSWSwA4VMlYAYDVMd0bxKhaE7NN9Q1'
    if not ak or not sk:
        raise ValueError("请配置华为云的 AK 和 SK")

    credentials = BasicCredentials(ak, sk)
    client = OcrClient.new_builder() \
        .with_credentials(credentials) \
        .with_region(OcrRegion.value_of("cn-north-4")) \
        .build()
    return client


@csrf_exempt
def process_image(request):
    if request.method == 'POST':
        try:
            # 解析请求数据
            data = json.loads(request.body)
            base64_image = data.get('image', '')
            if not base64_image:
                return JsonResponse({'status': 'error', 'message': '未提供图片数据'}, status=400)

            # 调用 OCR 处理
            ocr_result = process_image_with_huawei_ocr(base64_image)
            return JsonResponse({'status': 'success', 'data': ocr_result})

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': '无效的 JSON 数据'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


def process_image_with_huawei_ocr(base64_image):
    """调用华为云 OCR 服务处理图片"""
    try:
        client = init_ocr_client()

        # 配置身份证识别请求（人像面）
        request = RecognizeIdCardRequest()
        request.body = IdCardRequestBody(
            side="front",  # 识别正面（人像面）
            image=base64_image
        )

        # 发送 OCR 请求
        response = client.recognize_id_card(request)

        # 调试：打印原始响应结构
        #print("[DEBUG] 华为 OCR 原始响应:", response.to_json_object())

        # 提取关键字段
        result = response.result
        if not result:
            return {'status': 'error', 'message': 'OCR 未返回有效结果'}

        # 解析 OCR 结果
        ocr_data = {
            'name': result.name,
            'sex': result.sex,
            "ethnicity": result.ethnicity,
            'birth': result.birth,
            'address': result.address,
            'number': result.number,
        }
        return ocr_data

    except exceptions.ClientRequestException as e:
        # 处理华为 SDK 请求异常
        print(f"华为 OCR 请求失败: {e.error_msg}")
        return {'status': 'error', 'message': f'OCR 请求失败: {e.error_msg}'}
    except Exception as e:
        # 处理其他异常
        print(f"处理图片时发生错误: {str(e)}")
        return {'status': 'error', 'message': f'处理图片时发生错误: {str(e)}'}