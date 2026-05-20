export const metadata = {
  title: "Chính sách bảo mật | Belearning",
  description: "Chính sách bảo mật thông tin người dùng của Belearning",
}

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="space-y-6 mb-16 animate-in fade-in slide-in-from-top-8 duration-1000">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
            Chính sách <span className="text-[#FF6600]">Bảo mật</span>
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Cập nhật lần cuối: Tháng 5, 2026
          </p>
        </div>

        <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-a:text-[#FF6600] prose-a:no-underline hover:prose-a:underline animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <p className="lead text-xl text-zinc-600 font-medium">
            Tại Belearning (được vận hành bởi Betech Digital), chúng tôi coi trọng sự riêng tư của bạn. Trang này thông báo cho bạn về các chính sách của chúng tôi liên quan đến việc thu thập, sử dụng và tiết lộ thông tin cá nhân khi bạn sử dụng dịch vụ của chúng tôi.
          </p>

          <h2>1. Thu thập và Sử dụng Thông tin</h2>
          <p>
            Chúng tôi thu thập một số loại thông tin khác nhau cho các mục đích khác nhau để cung cấp và cải thiện dịch vụ cho bạn:
          </p>
          <ul>
            <li>
              <strong>Dữ liệu Cá nhân:</strong> Khi sử dụng Dịch vụ, chúng tôi có thể yêu cầu bạn cung cấp thông tin nhận dạng cá nhân như: Email, Tên, Số điện thoại, v.v.
            </li>
            <li>
              <strong>Dữ liệu Sử dụng:</strong> Chúng tôi cũng có thể thu thập thông tin về cách truy cập và sử dụng dịch vụ (ví dụ: địa chỉ IP máy tính, loại trình duyệt, các trang bạn truy cập).
            </li>
            <li>
              <strong>Dữ liệu Cookies:</strong> Chúng tôi sử dụng cookie và các công nghệ theo dõi tương tự để theo dõi hoạt động trên Dịch vụ và lưu giữ thông tin nhất định.
            </li>
          </ul>

          <h2>2. Cách chúng tôi sử dụng dữ liệu</h2>
          <p>Belearning sử dụng dữ liệu được thu thập cho các mục đích sau:</p>
          <ul>
            <li>Để cung cấp và duy trì dịch vụ.</li>
            <li>Để thông báo cho bạn về những thay đổi đối với dịch vụ.</li>
            <li>Để cho phép bạn tham gia vào các tính năng tương tác của dịch vụ.</li>
            <li>Để cung cấp dịch vụ chăm sóc và hỗ trợ khách hàng.</li>
            <li>Để phát hiện, ngăn chặn và giải quyết các vấn đề kỹ thuật.</li>
          </ul>

          <h2>3. Chuyển giao dữ liệu</h2>
          <p>
            Thông tin của bạn, bao gồm Dữ liệu Cá nhân, có thể được chuyển đến — và duy trì trên — các máy tính nằm ngoài tiểu bang, tỉnh, quốc gia hoặc khu vực tài phán của chính phủ khác nơi luật bảo vệ dữ liệu có thể khác với luật bảo vệ dữ liệu thuộc quyền tài phán của bạn.
          </p>

          <h2>4. Bảo mật dữ liệu</h2>
          <p>
            Tính bảo mật của dữ liệu của bạn rất quan trọng đối với chúng tôi, nhưng hãy nhớ rằng không có phương thức truyền tải nào qua Internet hoặc phương pháp lưu trữ điện tử nào an toàn 100%. Mặc dù chúng tôi cố gắng sử dụng các phương tiện được chấp nhận về mặt thương mại để bảo vệ Dữ liệu Cá nhân của bạn, nhưng chúng tôi không thể đảm bảo an ninh tuyệt đối của dữ liệu đó.
          </p>

          <h2>5. Quyền lợi của bạn</h2>
          <p>
            Bạn có quyền yêu cầu truy cập, sửa đổi, hoặc xóa dữ liệu cá nhân mà chúng tôi lưu trữ về bạn. Vui lòng liên hệ với chúng tôi để thực hiện các quyền này.
          </p>

          <hr className="my-12 border-zinc-100" />
          
          <div className="bg-orange-50/50 border border-orange-100 p-8 rounded-3xl">
            <h3 className="mt-0 text-zinc-900">Liên hệ với bộ phận Quyền riêng tư</h3>
            <p className="mb-0 text-zinc-600">
              Nếu bạn có bất kỳ thắc mắc hoặc phàn nàn nào về Chính sách Bảo mật này, vui lòng gửi email cho Data Protection Officer của chúng tôi: <strong>admin@betech-digital.com</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
