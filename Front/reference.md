// InputEvent
React.ChangeEvent<HTMLInputElement>

// ButtonEvent
React.MouseEvent<HTMLButtonElement>

// 무한스크롤 로직

```
  // 무한 스크롤 로직
  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    console.log(`감지결과 : ${isIntersecting}`);
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting) {
      setPage(prev => prev + 1);
    }
  };
  const { setTarget } = useIntersectionObserver({ onIntersect });
  // 위의 두 변수로 검사할 요소를 observer로 설정
  const [dumy, setDumy] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  // 여기에는 axios 요청 들어갈 예정
  useEffect(() => {
    for (let i = 0; i < 20; i++) {
      setDumy(prev => [...prev, `dumy${i}`]);
    }
  }, [page]);
```
