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
            # 打印请求体
            print("Request body:", request.body)
            data = json.loads(request.body)
            base64_image = data.get('image', '')
            if not base64_image:
                return JsonResponse({'status': 'error', 'message': '未提供图片数据'}, status=400)

            # 打印 base64 图片数据（前 100 个字符）
            print("Base64 image (first 100 chars):", base64_image[:100])

            # 调用 OCR 处理
            ocr_result = process_image_with_huawei_ocr(base64_image)
            return JsonResponse({'status': 'success', 'data': ocr_result})

        except json.JSONDecodeError:
            return JsonResponse({'status': 'error', 'message': '无效的 JSON 数据'}, status=400)
        except Exception as e:
            # 打印异常信息
            print("Exception:", str(e))
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


def process_image_with_huawei_ocr(base64_image):
    """调用华为云 OCR 服务处理图片"""
    try:
        client = init_ocr_client()

        # 配置通用文字识别请求
        request = RecognizeGeneralTextRequest()
        request.body = GeneralTextRequestBody(
            quick_mode=False,  # 关闭快速模式
            detect_direction=True,  # 启用文字方向检测
            image=base64_image  # 传入 base64 编码的图片数据
        )

        # 发送 OCR 请求
        response = client.recognize_general_text(request)

        # 打印完整的 OCR 响应数据
        print("OCR 响应数据:", response.to_json_object())

        # 提取关键字段
        result = response.result
        if not result:
            return {'status': 'error', 'message': 'OCR 未返回有效结果'}

        # 提取所有 words 字段
        words_list = [block.words for block in result.words_block_list]

        # 解析 OCR 结果
        ocr_data = {
            'words': words_list,  # 提取所有 words 字段
        }
        return ocr_data

    except exceptions.ClientRequestException as e:
        # 处理华为 SDK 请求异常
        print(f"华为 OCR 请求失败: {e}")
        return {'status': 'error', 'message': f'OCR 请求失败: {e}'}
    except Exception as e:
        # 处理其他异常
        print(f"处理图片时发生错误: {str(e)}")
        return {'status': 'error', 'message': f'处理图片时发生错误: {str(e)}'}