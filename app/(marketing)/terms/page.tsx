export const metadata = {
  title: "Điều khoản dịch vụ | Belearning",
  description: "Điều khoản và điều kiện sử dụng dịch vụ trên nền tảng Belearning",
}

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="space-y-6 mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
            Điều khoản <span className="text-[#FF6600]">Dịch vụ</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Cập nhật lần cuối: Tháng 5, 2026
          </p>
        </div>

        <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#FF6600] prose-a:no-underline hover:prose-a:underline animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <h2>1. Chấp nhận các điều khoản</h2>
          <p>
            Bằng việc truy cập hoặc sử dụng trang web Belearning, bạn đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, bạn có thể không truy cập được dịch vụ.
          </p>

          <h2>2. Tài khoản người dùng</h2>
          <p>
            Khi bạn tạo tài khoản với chúng tôi, bạn phải cung cấp thông tin chính xác, đầy đủ và cập nhật. Việc không làm như vậy cấu thành hành vi vi phạm Điều khoản, có thể dẫn đến việc chấm dứt ngay lập tức tài khoản của bạn trên dịch vụ của chúng tôi.
          </p>
          <p>
            Bạn có trách nhiệm bảo vệ mật khẩu mà bạn sử dụng để truy cập dịch vụ và cho bất kỳ hoạt động hoặc hành động nào theo mật khẩu của bạn.
          </p>

          <h2>3. Nội dung khóa học và Bản quyền</h2>
          <p>
            Dịch vụ và nội dung gốc, các tính năng và chức năng của nó đang và sẽ tiếp tục là tài sản độc quyền của Betech Digital và những người cấp phép của nó. Dịch vụ được bảo vệ bởi bản quyền, nhãn hiệu và các luật khác. Bạn không được phân phối, sửa đổi, truyền tải, tái sử dụng, tải xuống, đăng lại, sao chép hoặc sử dụng nội dung đó cho mục đích thương mại mà không có sự cho phép trước bằng văn bản rõ ràng từ chúng tôi.
          </p>

          <h2>4. Mua hàng và Hoàn tiền</h2>
          <p>
            Nếu bạn muốn mua bất kỳ sản phẩm hoặc dịch vụ nào thông qua trang web ("Mua hàng"), bạn có thể được yêu cầu cung cấp thông tin nhất định liên quan đến việc Mua hàng của bạn bao gồm nhưng không giới hạn ở số thẻ tín dụng, ngày hết hạn thẻ, v.v. Các chính sách hoàn tiền được áp dụng riêng cho từng khóa học và sẽ được hiển thị rõ ràng tại thời điểm Mua hàng.
          </p>

          <h2>5. Chấm dứt</h2>
          <p>
            Chúng tôi có thể chấm dứt hoặc đình chỉ tài khoản của bạn ngay lập tức, mà không cần thông báo trước hoặc chịu trách nhiệm pháp lý, vì bất kỳ lý do gì, bao gồm nhưng không giới hạn nếu bạn vi phạm Điều khoản. Sau khi chấm dứt, quyền sử dụng dịch vụ của bạn sẽ ngay lập tức chấm dứt.
          </p>

          <h2>6. Thay đổi điều khoản</h2>
          <p>
            Chúng tôi bảo lưu quyền, theo quyết định riêng của mình, sửa đổi hoặc thay thế các Điều khoản này bất kỳ lúc nào. Nếu bản sửa đổi là quan trọng, chúng tôi sẽ cố gắng cung cấp thông báo ít nhất 30 ngày trước khi bất kỳ điều khoản mới nào có hiệu lực.
          </p>

          <hr className="my-12 border-zinc-100" />
          
          <div className="bg-[#F8F9FA] p-8 rounded-3xl">
            <h3 className="mt-0">Bạn có câu hỏi?</h3>
            <p className="mb-0">
              Vui lòng liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về các Điều khoản này qua email: <strong>admin@betech-digital.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
