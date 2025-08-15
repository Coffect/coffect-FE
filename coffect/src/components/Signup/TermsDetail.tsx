import { useLocation, useNavigate } from "react-router-dom";
import TopNavbar from "./TopNavbar";

const TermsDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const step = location.state?.step ?? 3;

  return (
    <div className="relative h-screen bg-[var(--gray-0)]">
      {/* 상단바 */}
      <div className="abosolute box-border w-full max-w-md bg-[var(--gray-0)]">
        <TopNavbar
          title=""
          onBack={() => navigate("/signup", { state: { step } })}
        />
      </div>

      {/* 콘텐츠 */}
      <div
        className="absolute top-[56px] w-full overflow-y-auto bg-[var(--gray-0)] px-6 py-5"
        style={{ height: `calc(100vh - 56px)` }}
      >
        {/* 제목 */}
        <h1 className="text-2xl font-bold text-[var(--gray-90)]">
          서비스 이용 약관
        </h1>
        {/* 본문 */}
        <div className="mt-4 text-xs leading-relaxed whitespace-pre-wrap text-[var(--gray-50)]">
          <h2 className="mt-4 text-sm font-semibold">제 1장 총칙</h2>
          <div className="mt-4 text-xs">
            1. 본 약관은 Coffect(이하 “서비스”)의 이용과 관련하여 회사와 회원
            간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </div>
          <div className="mt-4 text-xs">
            2. 본 서비스는 커뮤니티, 채팅, 친구 추가, 프로필 열람 및 게시물 공유
            기능을 제공하며, 회원은 약관에 동의하고 회원가입 절차를 거친 후
            서비스를 이용할 수 있습니다.
          </div>
          <div className="mt-4 text-xs">
            3. 회사는 서비스 운영 정책, 보안, 기타 필요한 사유에 따라 본 약관을
            변경할 수 있으며, 변경 시 사전 공지합니다.
          </div>
        </div>

        <div className="text-xs leading-relaxed whitespace-pre-wrap text-[var(--gray-50)]">
          <h2 className="mt-4 text-sm font-semibold">
            제 2장 회원가입 및 계정
          </h2>
          <div className="mt-4 text-xs">
            1. 회원가입은 실명, 유효한 이메일, 학교 정보 등을 기재하고 인증
            절차를 완료함으로써 성립합니다.
          </div>
          <div className="mt-4 text-xs">
            2. 회원은 본인의 계정과 비밀번호를 안전하게 관리해야 하며, 계정
            도용이나 무단 사용으로 발생하는 모든 책임은 회원 본인에게 있습니다.
          </div>
          <div className="mt-4 text-xs">
            3. 허위 정보를 기재하거나 타인의 정보를 도용하는 경우 서비스 이용이
            제한되거나 계정이 삭제될 수 있습니다.
          </div>
        </div>

        <div className="text-xs leading-relaxed whitespace-pre-wrap text-[var(--gray-50)]">
          <h2 className="mt-4 text-sm font-semibold">제 3장 서비스 이용</h2>
          <div className="mt-4 text-xs">
            1. 회원은 법령과 본 약관, 서비스 이용 안내에 따라 서비스를 이용해야
            하며, 다음 행위를 해서는 안 됩니다.
            <br />- 타인의 개인정보 무단 수집·이용·공유
            <br />- 음란물, 폭력적 또는 혐오스러운 내용 게시
            <br />- 상업적 광고나 스팸 메시지 발송
            <br />- 서비스 기능을 악용하거나 시스템에 과도한 부하를 주는 행위
          </div>
          <div className="mt-4 text-xs">
            2. 위 금지 행위를 위반할 경우, 서비스 이용 제한, 계정 삭제, 법적
            조치가 취해질 수 있습니다.
          </div>
        </div>

        <div className="text-xs leading-relaxed whitespace-pre-wrap text-[var(--gray-50)]">
          <h2 className="mt-4 text-sm font-semibold">
            제 4장 콘텐츠 및 저작권
          </h2>
          <div className="mt-4 text-xs">
            1. 회원이 서비스에 게시한 모든 콘텐츠(글, 사진, 영상 등)의 저작권은
            해당 회원에게 있으며, 회사는 서비스 운영·홍보를 위해 합리적인 범위
            내에서 이를 활용할 수 있습니다.
          </div>
          <div className="mt-4 text-xs">
            2. 회원은 자신이 게시한 콘텐츠가 제3자의 저작권, 초상권, 기타 권리를
            침해하지 않도록 주의해야 하며, 이에 따른 법적 책임은 회원 본인에게
            있습니다.
          </div>
        </div>

        <div className="text-xs leading-relaxed whitespace-pre-wrap text-[var(--gray-50)]">
          <h2 className="mt-4 text-sm font-semibold">
            제 5장 서비스 변경 및 종료
          </h2>
          <div className="mt-4 text-xs">
            1. 회사는 운영상, 기술상 필요에 따라 서비스 내용을 변경하거나 일부
            또는 전부를 종료할 수 있습니다.
          </div>
          <div className="mt-4 text-xs">
            2. 서비스 종료 시, 회사는 사전에 회원에게 이를 공지하며, 관련 법령에
            따라 회원의 데이터를 처리합니다.
          </div>
        </div>

        <div className="text-xs leading-relaxed whitespace-pre-wrap text-[var(--gray-50)]">
          <h2 className="mt-4 text-sm font-semibold">제 6장 면책 및 기타</h2>
          <div className="mt-4 text-xs">
            1. 회사는 천재지변, 불가항력, 회원의 귀책 사유로 인한 서비스 중단 및
            데이터 손실에 대해 책임을 지지 않습니다.
          </div>
          <div className="mt-4 text-xs">
            2. 본 약관에서 정하지 않은 사항은 관련 법령 및 상관례에 따릅니다.
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsDetail;
